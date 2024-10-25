import { supabase } from './supabase';

export async function uploadImage(
  file: string, // Base64 string
  folder: string, // e.g., 'fire', 'ladder', etc.
  fileName: string
) {
  try {
    // Convert base64 to blob
    const base64Data = file.split(',')[1];
    const blob = Buffer.from(base64Data, 'base64');
    
    const filePath = `${folder}/${fileName}-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('audit-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('audit-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
