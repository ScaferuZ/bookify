<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 h-16">
        <div class="flex justify-between h-full">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900"> Bookify </NuxtLink>
            <NuxtLink
              to="/reading-lists"
              class="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Reading Lists
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Toast Container -->
  </div>
</template>
