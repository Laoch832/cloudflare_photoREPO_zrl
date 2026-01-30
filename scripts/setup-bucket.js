
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsqvrjgrwkwaqdybxqgy.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcXZyamdyd2t3YXFkeWJ4cWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA4OTk1NiwiZXhwIjoyMDgzNjY1OTU2fQ.joKU_nRzmK78QBxXFg9kRsUYIfmDMV0aYX5HKkQGpbo'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBucket() {
  const bucketName = 'cloudflare_photoREPO_zrl'
  
  console.log(`Checking bucket: ${bucketName}...`)
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('Error listing buckets:', listError)
    return
  }

  const bucket = buckets.find(b => b.name === bucketName)
  
  if (bucket) {
    console.log('Bucket already exists.')
    // Update public to true just in case
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/zip', 'text/*']
    })
    if (updateError) console.error('Error updating bucket:', updateError)
    else console.log('Bucket settings updated.')
  } else {
    console.log('Bucket does not exist. Creating...')
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800,
      allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/zip', 'text/*']
    })
    
    if (error) {
      console.error('Error creating bucket:', error)
    } else {
      console.log('Bucket created successfully.')
    }
  }
}

setupBucket()
