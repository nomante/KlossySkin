'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Progress } from '@/components/ui/progress';
import { Boxes, Package, Pencil, Trash2, Plus, Tag, DollarSign, LayoutGrid, ChevronRight, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PageType = 'dashboard' | 'products' | 'categories' | 'currencies' | 'hero';

interface Hero {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  badge_text?: string;
  image_url: string;
  active: boolean;
}

interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarButton({ icon: Icon, label, active, onClick }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        active
          ? 'bg-[#008d6e] text-white shadow-lg'
          : 'text-[#c9eee6] hover:bg-[#0b3b32] hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  isLoading = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  isLoading?: boolean;
}) {
  return (
    <Card className="border-[#d9f0ea] shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-xs md:text-sm font-semibold text-[#2f5f56] uppercase tracking-wide truncate">{label}</p>
            {isLoading ? (
              <div className="mt-2 space-y-1">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                <Progress value={65} max={100} />
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b3b32] mt-1">{value}</p>
            )}
          </div>
          <div className="bg-linear-to-br from-[#e7f7f3] to-[#c9eee6] p-2 sm:p-3 rounded-lg shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#008d6e]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    image: '',
    category: '',
    stock: '',
  });
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState(0);
  const [currencies, setCurrencies] = useState<{ id: string; code: string; symbol?: string | null }[]>([]);
  const [newCurrency, setNewCurrency] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyProgress, setCurrencyProgress] = useState(0);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);
  const [editCurrency, setEditCurrency] = useState<{ id: string; code: string; symbol?: string | null } | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteCurrencyTarget, setDeleteCurrencyTarget] = useState<{ id: string; code: string } | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_text: 'Shop Now',
    cta_link: '/products',
    badge_text: '',
    image_url: '',
    active: true,
  });
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);

  const totalStock = useMemo(() => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((sum, product) => sum + product.stock, 0);
  }, [products]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: 'Image',
        cell: ({ row }) => (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={48}
            height={48}
            className="rounded-md object-cover border border-[#e2f3ef]"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-semibold text-[#0b3b32]">{row.original.name}</p>
            <p className="text-xs text-[#2f5f56]">{row.original.category}</p>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <span className="text-sm text-[#0b3b32]">
            {row.original.currency} {row.original.price.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => (
          <Badge className="bg-[#e7f7f3] text-[#008d6e] border border-[#c9eee6]">
            {row.original.stock} units
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-[#f3d9d9] text-[#e05252] hover:bg-[#fdeeee]"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Auth check effect
  useEffect(() => {
    const verifyAuth = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        router.push('/');
        return;
      }
      if (status === 'authenticated' && session?.user) {
        const userRole = (session.user as { role?: string })?.role;
        if (!userRole || userRole !== 'admin') {
          router.push('/');
          return;
        }
        loadProducts();
        loadCategories();
        loadCurrencies();
        loadHeroes();
      }
    };
    verifyAuth();
  }, [status, session, router]);

  const loadProducts = async () => {
    setLoading(true);
    const response = await fetch('/api/products');
    const allProducts = await response.json();
    setProducts(Array.isArray(allProducts) ? allProducts : []);
    setLoading(false);
  };

  const loadCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const loadCurrencies = async () => {
    const response = await fetch('/api/currencies');
    const data = await response.json();
    setCurrencies(Array.isArray(data) ? data : []);
  };

  const loadHeroes = async () => {
    const response = await fetch('/api/hero');
    const data = await response.json();
    setHeroes(Array.isArray(data) ? data : []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary is not configured.');
      return;
    }

    setImageUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: form }
    );

    const data = await response.json();
    if (data.secure_url) {
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
    }
    setImageUploading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'USD',
      image: '',
      category: '',
      stock: '',
    });
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (categories.length === 0) {
      setFormError('Please add at least one category before creating a product.');
      return;
    }
    if (currencies.length === 0) {
      setFormError('Please add at least one currency before creating a product.');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (!formData.category.trim()) {
      setFormError('Category is required.');
      return;
    }
    if (!formData.image) {
      setFormError('Please upload a product image.');
      return;
    }
    if (!formData.price || Number.isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setFormError('Price must be greater than 0.');
      return;
    }
    if (!formData.stock || Number.isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      setFormError('Stock must be 0 or higher.');
      return;
    }
    setSaving(true);
    setSaveProgress(0);

    const progressInterval = setInterval(() => {
      setSaveProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 40));
    }, 100);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: formData.currency,
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock),
    };

    const response = await fetch(
      editingId ? `/api/products/${editingId}` : '/api/products',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      setSaveProgress(100);
      await loadProducts();
      resetForm();
      setShowForm(false);
    }

    clearInterval(progressInterval);
    setSaving(false);
    setSaveProgress(0);
  };

  const handleEdit = (product: Product) => {
    setShowForm(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      currency: product.currency,
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
    await loadProducts();
    setDeleteTarget(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    setCategoryLoading(true);
    setCategoryProgress(0);

    const progressInterval = setInterval(() => {
      setCategoryProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 40));
    }, 100);

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    if (response.ok) {
      setCategoryProgress(100);
      setNewCategory('');
      await loadCategories();
    }
    clearInterval(progressInterval);
    setCategoryLoading(false);
    setCategoryProgress(0);
  };

  const handleUpdateCategory = async () => {
    if (!editCategory) return;
    const response = await fetch(`/api/categories/${editCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editCategory.name.trim() }),
    });
    if (response.ok) {
      setEditCategory(null);
      await loadCategories();
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    await fetch(`/api/categories/${deleteCategoryTarget.id}`, { method: 'DELETE' });
    setDeleteCategoryTarget(null);
    await loadCategories();
  };

  const handleCreateCurrency = async () => {
    if (!newCurrency.trim()) return;
    setCurrencyLoading(true);
    setCurrencyProgress(0);

    const progressInterval = setInterval(() => {
      setCurrencyProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 40));
    }, 100);

    const response = await fetch('/api/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCurrency.trim().toUpperCase(),
        symbol: newCurrencySymbol.trim() || null,
      }),
    });
    if (response.ok) {
      setCurrencyProgress(100);
      setNewCurrency('');
      setNewCurrencySymbol('');
      await loadCurrencies();
    }
    clearInterval(progressInterval);
    setCurrencyLoading(false);
    setCurrencyProgress(0);
  };

  const handleUpdateCurrency = async () => {
    if (!editCurrency) return;
    const response = await fetch(`/api/currencies/${editCurrency.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: editCurrency.code.trim().toUpperCase(),
        symbol: editCurrency.symbol?.trim() || null,
      }),
    });
    if (response.ok) {
      setEditCurrency(null);
      await loadCurrencies();
    }
  };

  const handleDeleteCurrency = async () => {
    if (!deleteCurrencyTarget) return;
    await fetch(`/api/currencies/${deleteCurrencyTarget.id}`, { method: 'DELETE' });
    setDeleteCurrencyTarget(null);
    await loadCurrencies();
  };

  const getPageTitle = (): string => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'products':
        return 'Products';
      case 'categories':
        return 'Categories';
      case 'currencies':
        return 'Currencies';
      case 'hero':
        return 'Hero Section';
      default:
        return 'Admin';
    }
  };

  const handleBackToStore = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
    window.location.href = '/';
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary is not configured.');
      return;
    }

    setHeroImageUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();
    if (data.secure_url) {
      setHeroFormData((prev) => ({ ...prev, image_url: data.secure_url }));
    }
    setHeroImageUploading(false);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFormData.title || !heroFormData.subtitle) {
      alert('Title and subtitle are required');
      return;
    }

    const url = editingHeroId ? `/api/hero/${editingHeroId}` : '/api/hero';
    const method = editingHeroId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroFormData),
    });

    if (response.ok) {
      await loadHeroes();
      setShowHeroForm(false);
      setEditingHeroId(null);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fffe]">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-[#2f5f56] font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as { role?: string })?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fffe]">
        <div className="text-center">
          <p className="text-[#2f5f56] font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fffe] flex flex-col lg:flex-row">
      {/* Sidebar - Desktop: left side (w-64, order-1), Mobile: full width at bottom */}
      <aside className="w-full lg:w-64 bg-[#0b3b32] order-2 lg:order-1 flex flex-col">
        <div className="p-3 sm:p-4 md:p-6 border-b border-[#008d6e]">
          <div className="flex flex-row lg:flex-col items-center gap-2 lg:gap-3">
            <div className="bg-white rounded-full p-2 lg:p-3 shrink-0">
              <Image src="/logo.png" alt="KlossySkin Logo" width={64} height={64} className="h-10 w-10 lg:h-16 lg:w-16" />
            </div>
            <div className="text-center hidden lg:block">
              <h1 className="text-base lg:text-xl font-bold text-white">Klassy Skin Care</h1>
              <p className="text-[#c9eee6] text-xs">Admin Dashboard</p>
            </div>
            <div className="text-left lg:text-center block lg:hidden flex-1">
              <h1 className="text-base font-bold text-white">Klassy</h1>
              <p className="text-[#c9eee6] text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="p-4 sm:p-6 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto flex-1">
          <SidebarButton icon={LayoutGrid} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <SidebarButton icon={Package} label="Products" active={currentPage === 'products'} onClick={() => setCurrentPage('products')} />
          <SidebarButton icon={Tag} label="Categories" active={currentPage === 'categories'} onClick={() => setCurrentPage('categories')} />
          <SidebarButton icon={DollarSign} label="Currencies" active={currentPage === 'currencies'} onClick={() => setCurrentPage('currencies')} />
          <SidebarButton icon={Zap} label="Hero Section" active={currentPage === 'hero'} onClick={() => setCurrentPage('hero')} />
        </nav>

        <div className="p-4 sm:p-6 lg:p-4 border-t border-[#008d6e]">
          <button onClick={handleBackToStore} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-[#c9eee6] text-[#0b3b32] hover:bg-white transition-all">
            <ChevronRight className="h-4 w-4" />
            Back to Store
          </button>
        </div>
      </aside>

      {/* Main Content - Desktop: flex-1 on right, Mobile: full width at top */}
      <main className="flex-1 overflow-auto order-1 lg:order-2">
        {/* Header */}
        <div className="bg-white border-b border-[#e2f3ef] sticky top-0 z-10 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b3b32]">{getPageTitle()}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <StatsCard icon={Package} label="Products" value={products.length} isLoading={loading} />
                <StatsCard icon={LayoutGrid} label="Total Stock" value={totalStock} isLoading={loading} />
                <StatsCard icon={Boxes} label="Categories" value={categories.length} isLoading={loading} />
                <StatsCard icon={DollarSign} label="Currencies" value={currencies.length} isLoading={loading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-[#d9f0ea] shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0b3b32] mb-2">Product Management</h3>
                    <p className="text-sm sm:text-base text-[#2f5f56] mb-4">Add, edit, or remove products from your catalog</p>
                    <Button
                      onClick={() => setCurrentPage('products')}
                      className="bg-[#1e7864] text-white hover:bg-[#008d6e] w-full text-sm sm:text-base"
                    >
                      Go to Products <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-[#d9f0ea] shadow-md hover:shadow-lg transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0b3b32] mb-2">Configuration</h3>
                    <p className="text-sm sm:text-base text-[#2f5f56] mb-4">Manage categories and currencies</p>
                    <div className="flex gap-2">
                      <Button onClick={() => setCurrentPage('categories')} variant="outline" className="flex-1 border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3] text-sm sm:text-base">
                        Categories
                      </Button>
                      <Button onClick={() => setCurrentPage('currencies')} variant="outline" className="flex-1 border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3] text-sm sm:text-base">
                        Currencies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products */}
          {currentPage === 'products' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#1e7864] text-white hover:bg-[#008d6e] shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add New Product
                </Button>
              </div>

              <Card className="border-[#d9f0ea] shadow-lg">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="p-8 sm:p-12 md:p-20 flex flex-col items-center justify-center">
                        <Spinner className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-4" />
                        <p className="text-sm sm:text-base text-[#2f5f56]">Loading products...</p>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="p-8 sm:p-12 md:p-20 text-center">
                        <Package className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#d9f0ea] mx-auto mb-4" />
                        <p className="text-base sm:text-lg text-[#2f5f56] mb-2">No products yet</p>
                        <p className="text-xs sm:text-sm text-[#999]">Add your first product to get started</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-[#f4fbf9] border-b border-[#d9f0ea]">
                          {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#0b3b32] uppercase tracking-wide">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody className="divide-y divide-[#edf6f4]">
                          {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-[#f9fffe] transition-colors">
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories */}
          {currentPage === 'categories' && (
            <div className="space-y-4 sm:space-y-6 max-w-2xl">
              <Card className="border-[#d9f0ea] shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0b3b32] mb-4">Add New Category</h3>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Input type="text" placeholder="Category name..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] text-sm" disabled={categoryLoading} />
                    <Button onClick={handleCreateCategory} disabled={categoryLoading} className="bg-[#1e7864] text-white hover:bg-[#008d6e] shrink-0 text-sm sm:text-base">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {categoryLoading && <div className="mt-3"><Progress value={categoryProgress} max={100} /></div>}
                </CardContent>
              </Card>

              <Card className="border-[#d9f0ea] shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0b3b32] mb-4">Categories ({categories.length})</h3>
                  <div className="space-y-2">
                    {categories.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-[#2f5f56]">
                        <p>No categories yet. Create your first one!</p>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 sm:p-4 bg-[#f9fffe] rounded-lg border border-[#e2f3ef] hover:border-[#d9f0ea] transition-all group">
                          <span className="font-medium text-sm sm:text-base text-[#0b3b32] truncate">{category.name}</span>
                          <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button size="sm" variant="ghost" className="text-[#1e7864] hover:bg-[#e7f7f3] h-8 w-8 p-0" onClick={() => setEditCategory(category)}>
                              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#e05252] hover:bg-[#fdeeee] h-8 w-8 p-0" onClick={() => setDeleteCategoryTarget(category)}>
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Currencies */}
          {currentPage === 'currencies' && (
            <div className="space-y-4 sm:space-y-6 max-w-2xl">
              <Card className="border-[#d9f0ea] shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0b3b32] mb-4">Add New Currency</h3>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Input type="text" placeholder="Code (USD)" value={newCurrency} onChange={(e) => setNewCurrency(e.target.value)} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] text-sm" disabled={currencyLoading} />
                    <Input type="text" placeholder="Symbol ($)" value={newCurrencySymbol} onChange={(e) => setNewCurrencySymbol(e.target.value)} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] text-sm" disabled={currencyLoading} />
                    <Button onClick={handleCreateCurrency} disabled={currencyLoading} className="bg-[#1e7864] text-white hover:bg-[#008d6e] shrink-0 text-sm sm:text-base">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {currencyLoading && <div className="mt-3"><Progress value={currencyProgress} max={100} /></div>}
                </CardContent>
              </Card>

              <Card className="border-[#d9f0ea] shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0b3b32] mb-4">Currencies ({currencies.length})</h3>
                  <div className="space-y-2">
                    {currencies.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-[#2f5f56]">
                        <p>No currencies yet. Create your first one!</p>
                      </div>
                    ) : (
                      currencies.map((currency) => (
                        <div key={currency.code} className="flex items-center justify-between p-3 sm:p-4 bg-[#f9fffe] rounded-lg border border-[#e2f3ef] hover:border-[#d9f0ea] transition-all group">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-sm sm:text-base text-[#0b3b32]">{currency.code}</span>
                            {currency.symbol && <span className="text-xs sm:text-sm text-[#2f5f56] ml-2">({currency.symbol})</span>}
                          </div>
                          <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button size="sm" variant="ghost" className="text-[#1e7864] hover:bg-[#e7f7f3] h-8 w-8 p-0" onClick={() => setEditCurrency(currency)}>
                              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#e05252] hover:bg-[#fdeeee] h-8 w-8 p-0" onClick={() => setDeleteCurrencyTarget(currency)}>
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hero */}
          {currentPage === 'hero' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0b3b32]">Manage Hero Section</h3>
                  <p className="text-sm sm:text-base text-[#2f5f56] mt-1">Customize your landing page hero banner</p>
                </div>
                <Button onClick={() => { setEditingHeroId(null); setHeroFormData({ title: '', subtitle: '', description: '', cta_text: 'Shop Now', cta_link: '/products', badge_text: '', image_url: '', active: true }); setShowHeroForm(true); }} className="bg-[#1e7864] text-white hover:bg-[#008d6e]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Hero Banner
                </Button>
              </div>

              {heroes.length === 0 ? (
                <Card className="border-[#d9f0ea] shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Zap className="h-16 w-16 text-[#d9f0ea] mx-auto mb-4" />
                    <p className="text-[#2f5f56]">No hero banners yet. Create one to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {heroes.map((hero) => (
                    <Card key={hero.id} className="border-[#d9f0ea] shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          {hero.image_url && (
                            <div className="shrink-0">
                              <Image src={hero.image_url} alt={hero.title} width={128} height={96} className="rounded-lg object-cover border border-[#d9f0ea]" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-bold text-[#0b3b32]">{hero.title}</h4>
                              <Badge className={hero.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {hero.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#2f5f56] mb-3">{hero.subtitle}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => { setEditingHeroId(hero.id); setHeroFormData({ title: hero.title, subtitle: hero.subtitle, description: hero.description || '', cta_text: hero.cta_text || 'Shop Now', cta_link: hero.cta_link || '/products', badge_text: hero.badge_text || '', image_url: hero.image_url, active: hero.active }); setShowHeroForm(true); }}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="border-[#f3d9d9] text-[#e05252] hover:bg-[#fdeeee]" onClick={async () => { await fetch(`/api/hero/${hero.id}`, { method: 'DELETE' }); await loadHeroes(); }}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && setShowForm(false)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription className="text-base">
              Fill in the details below to {editingId ? 'update' : 'create'} a product.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="border-[#d9f0ea] focus:ring-[#1e7864] focus:border-[#1e7864] bg-[#fafffe]">
                <SelectValue placeholder={categories.length === 0 ? 'Add categories first' : 'Select Category'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" name="price" placeholder="Price" step="0.01" value={formData.price} onChange={handleChange} required className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <Select value={formData.currency} onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}>
              <SelectTrigger className="border-[#d9f0ea] focus:ring-[#1e7864] focus:border-[#1e7864] bg-[#fafffe]">
                <SelectValue placeholder={currencies.length === 0 ? 'Add currencies first' : 'Currency'} />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code}{currency.symbol ? ` (${currency.symbol})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <Input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe] md:col-span-2" />
            <div className="md:col-span-2 space-y-3 p-4 bg-[#f9fffe] rounded-lg border border-[#e2f3ef]">
              <label className="text-sm font-semibold text-[#0b3b32]">Product Image</label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] cursor-pointer" />
              {imageUploading && (
                <div className="flex items-center gap-2 text-sm text-[#2f5f56]">
                  <Spinner className="h-4 w-4" />
                  Uploading image...
                </div>
              )}
              {formData.image && !imageUploading && (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image src={formData.image} alt="Preview" width={80} height={80} className="rounded-lg object-cover border-2 border-[#c9eee6] shadow-sm" />
                    <div className="absolute -top-2 -right-2 bg-[#008d6e] text-white rounded-full p-1">✓</div>
                  </div>
                  <p className="text-sm text-[#008d6e] font-medium">Image ready</p>
                </div>
              )}
            </div>
            {formError && (
              <div className="md:col-span-2 p-3 bg-[#fdeeee] border border-[#f3d9d9] rounded-lg text-sm text-[#c94444]">
                {formError}
              </div>
            )}
            {saving && <div className="md:col-span-2"><Progress value={saveProgress} max={100} /></div>}
            <DialogFooter className="md:col-span-2 mt-6 gap-2">
              <Button type="button" variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => { resetForm(); setShowForm(false); }} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1e7864] text-white hover:bg-[#008d6e]" disabled={imageUploading || saving}>
                {saving ? <span className="flex items-center gap-2">{editingId ? 'Updating...' : 'Adding...'}</span> : (editingId ? 'Update Product' : 'Add Product')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <Trash2 className="h-6 w-6" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This will permanently remove <span className="font-bold text-[#0b3b32]">{deleteTarget?.name}</span>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={Boolean(editCategory)} onOpenChange={(open) => !open && setEditCategory(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input value={editCategory?.name ?? ''} onChange={(e) => setEditCategory((prev) => (prev ? { ...prev, name: e.target.value } : prev))} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <DialogFooter className="gap-2">
              <Button variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setEditCategory(null)}>
                Cancel
              </Button>
              <Button className="bg-[#1e7864] text-white hover:bg-[#008d6e]" onClick={handleUpdateCategory}>
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={Boolean(deleteCategoryTarget)} onOpenChange={(open) => !open && setDeleteCategoryTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <Trash2 className="h-6 w-6" />
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This will permanently remove <span className="font-bold text-[#0b3b32]">{deleteCategoryTarget?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setDeleteCategoryTarget(null)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteCategory}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Currency Dialog */}
      <Dialog open={Boolean(editCurrency)} onOpenChange={(open) => !open && setEditCurrency(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Currency</DialogTitle>
            <DialogDescription>Update the currency code or symbol.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input value={editCurrency?.code ?? ''} onChange={(e) => setEditCurrency((prev) => (prev ? { ...prev, code: e.target.value } : prev))} placeholder="Code" className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <Input value={editCurrency?.symbol ?? ''} onChange={(e) => setEditCurrency((prev) => (prev ? { ...prev, symbol: e.target.value } : prev))} placeholder="Symbol" className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            <DialogFooter className="gap-2">
              <Button variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setEditCurrency(null)}>
                Cancel
              </Button>
              <Button className="bg-[#1e7864] text-white hover:bg-[#008d6e]" onClick={handleUpdateCurrency}>
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Currency Dialog */}
      <Dialog open={Boolean(deleteCurrencyTarget)} onOpenChange={(open) => !open && setDeleteCurrencyTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <Trash2 className="h-6 w-6" />
              Delete Currency
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This will permanently remove <span className="font-bold text-[#0b3b32]">{deleteCurrencyTarget?.code}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setDeleteCurrencyTarget(null)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteCurrency}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Form Dialog */}
      <Dialog open={showHeroForm} onOpenChange={(open) => !open && setShowHeroForm(false)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingHeroId ? 'Edit Hero Banner' : 'Create Hero Banner'}</DialogTitle>
            <DialogDescription className="text-base">
              Customize your landing page hero section with promotional content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleHeroSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 space-y-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">Hero Title *</label>
              <Input placeholder="e.g., Summer Sale 2024" value={heroFormData.title} onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">Subtitle *</label>
              <Input placeholder="e.g., Get up to 50% off on all skincare products" value={heroFormData.subtitle} onChange={(e) => setHeroFormData({ ...heroFormData, subtitle: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">Description</label>
              <Input placeholder="e.g., Discover our premium collection of natural skincare" value={heroFormData.description} onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">CTA Button Text</label>
              <Input placeholder="e.g., Shop Now" value={heroFormData.cta_text} onChange={(e) => setHeroFormData({ ...heroFormData, cta_text: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">CTA Button Link</label>
              <Input placeholder="e.g., /products" value={heroFormData.cta_link} onChange={(e) => setHeroFormData({ ...heroFormData, cta_link: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0b3b32]">Badge Text</label>
              <Input placeholder="e.g., New Collection" value={heroFormData.badge_text} onChange={(e) => setHeroFormData({ ...heroFormData, badge_text: e.target.value })} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] bg-[#fafffe]" />
            </div>

            <div className="md:col-span-2 space-y-3 p-4 bg-[#f9fffe] rounded-lg border border-[#e2f3ef]">
              <label className="text-sm font-semibold text-[#0b3b32]">Hero Image</label>
              <Input type="file" accept="image/*" onChange={handleHeroImageUpload} className="border-[#d9f0ea] focus-visible:ring-[#1e7864] focus-visible:border-[#1e7864] cursor-pointer" />
              {heroImageUploading && (
                <div className="flex items-center gap-2 text-sm text-[#2f5f56]">
                  <Spinner className="h-4 w-4" />
                  Uploading image...
                </div>
              )}
              {heroFormData.image_url && !heroImageUploading && (
                <div className="flex items-center gap-4">
                  <Image src={heroFormData.image_url} alt="Preview" width={128} height={80} className="rounded-lg object-cover border-2 border-[#c9eee6]" />
                  <span className="text-sm text-[#008d6e] font-medium">Image ready ✓</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={heroFormData.active} onChange={(e) => setHeroFormData({ ...heroFormData, active: e.target.checked })} className="w-4 h-4 cursor-pointer" />
              <label className="text-sm font-semibold text-[#0b3b32] cursor-pointer">Active on Homepage</label>
            </div>

            <DialogFooter className="md:col-span-2 mt-6 gap-2">
              <Button type="button" variant="outline" className="border-[#d9f0ea] text-[#1e7864] hover:bg-[#e7f7f3]" onClick={() => setShowHeroForm(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1e7864] text-white hover:bg-[#008d6e]">
                {editingHeroId ? 'Update Banner' : 'Create Banner'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
