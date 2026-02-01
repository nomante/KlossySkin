import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Hero } from '@/lib/entities/Hero';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(Hero);
    const hero = await heroRepository.findOne({ where: { id } });

    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(Hero);
    const hero = await heroRepository.findOne({ where: { id } });

    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }

    const data = await request.json();
    const { title, subtitle, description, cta_text, cta_link, badge_text, image_url, active } = data;

    if (title) hero.title = title;
    if (subtitle) hero.subtitle = subtitle;
    if (description !== undefined) hero.description = description;
    if (cta_text !== undefined) hero.cta_text = cta_text;
    if (cta_link !== undefined) hero.cta_link = cta_link;
    if (badge_text !== undefined) hero.badge_text = badge_text;
    if (image_url !== undefined) hero.image_url = image_url;
    if (active !== undefined) hero.active = active;

    await heroRepository.save(hero);
    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating hero:', error);
    return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(Hero);
    const hero = await heroRepository.findOne({ where: { id } });

    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }

    await heroRepository.remove(hero);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero:', error);
    return NextResponse.json({ error: 'Failed to delete hero' }, { status: 500 });
  }
}
