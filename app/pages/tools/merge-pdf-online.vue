<script setup lang="ts">
useSeoMeta({
  title: 'Merge PDF Online Free — No Upload, Private',
  description: 'Merge PDF files online in your browser. Combine multiple PDFs into one without uploading. Free and private.',
  ogTitle: 'Merge PDF Online Free',
  ogDescription: 'Private browser-based PDF merge. No signup, no uploads.',
})

const compareRows = [
  { label: 'Privacy', other: 'Files uploaded to a server', us: 'Processed only on your device' },
  { label: 'Signup', other: 'Often required', us: 'Not required' },
  { label: 'Reorder pages', other: 'Varies', us: 'Yes — move files up/down before merge' },
  { label: 'Cost', other: 'Freemium / watermarks', us: 'Free tool page' },
]

const faqs = [
  {
    q: 'Is it safe to merge PDFs here?',
    a: 'Yes for privacy: merging runs in your browser with pdf-lib. Your documents are not uploaded to QuickFile Tools servers.',
  },
  {
    q: 'How many PDFs can I merge?',
    a: 'Add two or more files, reorder them, then merge. Very large files may be limited by your device memory.',
  },
  {
    q: 'What if a PDF is password-protected?',
    a: 'Encrypted PDFs may fail. Remove the password in a PDF editor you trust first if you own the file.',
  },
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
      Merge PDF Online Free
    </h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      Combine multiple PDF files into one document in your browser. No upload, no account — built for private paperwork, study packs, and invoices.
    </p>
    <AdSlot class="mt-6" />
    <div class="mt-6">
      <ClientOnly>
        <ToolsPdfMergeTool />
        <template #fallback>
          <p class="text-sm text-slate-500">Loading PDF merge tool…</p>
        </template>
      </ClientOnly>
    </div>

    <p class="mt-8 text-sm text-slate-600">
      Guides:
      <NuxtLink to="/blog/how-to-merge-pdfs-online" class="font-medium text-teal-700 hover:underline">
        How to merge PDFs online
      </NuxtLink>
      ·
      <NuxtLink to="/blog/split-pdf-without-uploading" class="font-medium text-teal-700 hover:underline">
        Split PDF without uploading
      </NuxtLink>
      ·
      <NuxtLink to="/tools/pdf-split" class="font-medium text-teal-700 hover:underline">
        PDF Split tool
      </NuxtLink>
    </p>

    <div class="mt-12 space-y-10 text-slate-700">
      <section>
        <h2 class="text-xl font-semibold text-slate-900">How to merge PDFs (local)</h2>
        <ol class="mt-4 list-decimal space-y-2 pl-5">
          <li>Add two or more PDF files.</li>
          <li>Use Up / Down to set the page order.</li>
          <li>Click Merge PDFs.</li>
          <li>Download the combined file.</li>
        </ol>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900">Why merge locally?</h2>
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-100 text-slate-900">
              <tr>
                <th class="px-4 py-3 font-semibold">Feature</th>
                <th class="px-4 py-3 font-semibold">Typical upload sites</th>
                <th class="px-4 py-3 font-semibold">QuickFile Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in compareRows" :key="row.label" class="border-t border-slate-200">
                <td class="px-4 py-3 font-medium text-slate-900">{{ row.label }}</td>
                <td class="px-4 py-3">{{ row.other }}</td>
                <td class="px-4 py-3">{{ row.us }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-slate-900">FAQ</h2>
        <dl class="mt-4 space-y-4">
          <div v-for="item in faqs" :key="item.q" class="rounded-lg border border-slate-200 bg-white p-4">
            <dt class="font-semibold text-slate-900">{{ item.q }}</dt>
            <dd class="mt-2 text-sm">{{ item.a }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>
