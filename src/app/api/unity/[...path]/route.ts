import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'public', 'webgl_spookie pookie', 'Build', ...params.path)
    
    // Read the .br file
    const fileBuffer = await readFile(filePath)
    
    // Set appropriate headers for Brotli compressed files
    const headers = new Headers()
    headers.set('Content-Encoding', 'br')
    headers.set('Content-Type', 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=31536000')
    
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error serving Unity file:', error)
    return new NextResponse('File not found', { status: 404 })
  }
}
