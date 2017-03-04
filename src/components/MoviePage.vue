<template>
  <div class="container info">
    <movie :id="$route.params.id" :type="'page'"></movie>
  </div>
</template>

<script>
import Movie from './Movie.vue';
export default {
  components: { Movie }
}
</script>
