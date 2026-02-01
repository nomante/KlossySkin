import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Hero } from '@/lib/entities/Hero';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(Hero);
    let heroes = await heroRepository.find({ order: { createdAt: 'DESC' } });

    // Auto-seed with default hero if empty
    if (heroes.length === 0) {
      const defaultHero = heroRepository.create({
        title: 'KlossySkin — Radiance in every routine.',
        subtitle: 'Get up to 50% off on all skincare products',
        description: 'Thoughtfully curated skincare essentials made to elevate your daily ritual.',
        cta_text: 'Shop the Collection',
        cta_link: '/products',
        badge_text: 'Clean, modern skincare',
        image_url: null,
        active: true,
      });
      await heroRepository.save(defaultHero);
      heroes = [defaultHero];
    }

    return NextResponse.json(heroes);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json({ error: 'Failed to fetch heroes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(Hero);
    const data = await request.json();

    const { title, subtitle, description, cta_text, cta_link, badge_text, image_url, active } = data;

    if (!title || !subtitle) {
      return NextResponse.json({ error: 'Title and subtitle are required' }, { status: 400 });
    }

    const hero = heroRepository.create({
      title,
      subtitle,
      description: description || '',
      cta_text: cta_text || 'Shop Now',
      cta_link: cta_link || '/products',
      badge_text: badge_text || '',
      image_url: image_url || null,
      active: active !== undefined ? active : true,
    });

    await heroRepository.save(hero);
    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error('Error creating hero:', error);
    return NextResponse.json({ error: 'Failed to create hero' }, { status: 500 });
  }
}
