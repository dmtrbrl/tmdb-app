<template>
  <div class="movie-popup" @click="$emit('close')">
    <div class="movie-popup__box" @click.stop>
      <movie :id="id"></movie>
      <button class="movie-popup__close" @click="$emit('close')"></button>
    </div>
    <i class="loader"></i>
  </div>
</template>

<script>
import Movie from './Movie.vue';

export default {
  props: ['id'],
  components: { Movie },
  created(){
    window.addEventListener('keyup', function(e){
      if (e.keyCode == 27) {
        this.$emit('close');
      }
    }.bind(this));
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.movie-popup{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100vh;
  background: rgba($c-dark, 0.98);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  &__box{
    width: 100%;
    max-width: 768px;
    position: relative;
    z-index: 5;
    background: $c-dark;
    padding-bottom: 50px;
    @include tablet-min{
      padding-bottom: 0;
      margin: 40px auto;
    }
  }
  &__close{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    background: transparent;
    width: 40px;
    height: 40px;
    transition: background 0.5s ease;
    cursor: pointer;
    &:before,
    &:after{
      content: "";
      display: block;
      position: absolute;
      top: 19px;
      left: 10px;
      width: 20px;
      height: 2px;
      background: $c-white;
    }
    &:before{
      transform: rotate(45deg);
    }
    &:after{
      transform: rotate(-45deg);
    }
    &:hover{
      background: $c-green;
    }
  }
}
</style>
