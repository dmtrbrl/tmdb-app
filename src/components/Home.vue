<template>
  <section class="home">
    <header class="home__header">
      <div class="home__header-wrap">
        <h1 class="home__header-title">The Movie DB App</h1>
        <strong class="home__header-subtitle">Made with Vue.js</strong>
        <a href="https://github.com/dmtrbrl/tmdb-app" target="_blank" class="home__header-link">
          <svg class="home__header-link-icon">
            <use xlink:href="#iconGithub"></use>
          </svg>
          <span>View Code</span>
        </a>
      </div>
    </header>
    <movies-list v-for="item in listTypes" v-if="item.isCategory" :type="'component'" :mode="'collection'" :category="item.query" :shortList="true"></movies-list>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import MoviesList from './MoviesList.vue'

export default {
  components: { MoviesList },
  data(){
    return {
      listTypes: storage.listTypes
    }
  },
  created(){
    document.title = 'TMDb';
    storage.backTitle = document.title;
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.home{
  &__header{
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    position: relative;
    background-color: $c-dark;
    background-image: url('~assets/pulp-fiction.jpg');
    @include tablet-min{
      height: 384px;
    }
    &:before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba($c-light, 0.7);
    }
    &-wrap{
      text-align: center;
      position: relative;
    }
    &-title{
      font-weight: 500;
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: $c-dark;
      margin: 0;
      @include tablet-min{
        font-size: 28px;
      }
    }
    &-subtitle{
      display: block;
      font-size: 14px;
      font-weight: 300;
      color: $c-dark;
      margin: 5px 0;
      @include tablet-min{
        font-size: 16px;
      }
    }
    &-link{
      text-decoration: none;
      color: $c-dark;
      font-size: 13px;
      font-weight: 300;
      opacity: 0.7;
      transition: opacity 0.5s ease;
      &:hover{
        opacity: 1;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
      &-icon{
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        width: 16px;
        height: 15px;
        fill: $c-dark;
      }
    }
  }
  .wrapper{
    min-height: 0;
  }
  .movies__list{
    .movies__item:last-child{
      display: none;
      @include desktop-min{
        display: block;
      }
    }
  }
}
</style>
