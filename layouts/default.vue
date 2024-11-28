<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 h-16">
        <div class="flex justify-between h-full">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900"> Bookify </NuxtLink>
            <NuxtLink to="/books" class="text-sm font-medium text-gray-500 hover:text-gray-900">
              Browse
            </NuxtLink>
            <NuxtLink
              to="/reading-lists"
              class="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Reading Lists
            </NuxtLink>
          </div>
          <div class="flex items-center">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>
