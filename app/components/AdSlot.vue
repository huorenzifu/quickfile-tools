<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'Advertisement',
})
</script>

<template>
  <div
    class="my-6 flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-100/80 px-4 py-6 text-center text-xs text-slate-500"
    role="presentation"
    data-ad-slot="placeholder"
  >
    {{ label }} placeholder — AdSense unit will go here after approval
  </div>
</template>
