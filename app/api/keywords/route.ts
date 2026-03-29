import { NextRequest, NextResponse } from 'next/server'
import { getKeywords } from '@/lib/db/queries'
import { addKeyword, deleteKeyword } from '@/lib/db/mutations'
import { DEV_USER_ID } from '@/lib/types/user'

export async function GET() {
  try {
    const keywords = await getKeywords(DEV_USER_ID)
    return NextResponse.json({ keywords })
  } catch (err) {
    console.error('GET /api/keywords error:', err)
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { keyword?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const keyword = body.keyword?.trim().toLowerCase()
  if (!keyword) {
    return NextResponse.json({ error: 'keyword is required' }, { status: 422 })
  }
  if (keyword.length > 40) {
    return NextResponse.json({ error: 'keyword too long' }, { status: 422 })
  }

  try {
    const kw = await addKeyword(keyword, DEV_USER_ID)
    return NextResponse.json(kw, { status: 201 })
  } catch (err) {
    console.error('POST /api/keywords error:', err)
    return NextResponse.json({ error: 'Failed to add keyword' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 422 })
  }

  try {
    await deleteKeyword(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/keywords error:', err)
    return NextResponse.json({ error: 'Failed to delete keyword' }, { status: 500 })
  }
}
