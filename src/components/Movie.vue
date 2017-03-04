<template>
  <section class="movie">
    <div class="movie__container" v-if="movieLoaded">
      <header class="movie__header" :class="{'movie__header--page': type=='page'}" :style="{ 'background-image': 'url(' + movieBackdropSrc + ')' }">
        <div class="movie__wrap movie__wrap--header" :class="{'movie__wrap--page': type=='page'}">
          <figure class="movie__poster">
            <img v-if="moviePosterSrc" class="movie__img" src="~assets/placeholder.png" v-img="moviePosterSrc">
            <img v-if="!moviePosterSrc" class="movies-item__img is-loaded" src="~assets/no-image.png">
          </figure>
          <div class="movie__title">
            <h1 class="movie__title-text">
              {{ movie.title }}
              <span v-if="movie.tagline">{{ movie.tagline }}</span>
            </h1>
          </div>
        </div>
      </header>
      <div class="movie__main">
        <div class="movie__wrap movie__wrap--main" :class="{'movie__wrap--page': type=='page'}">
          <div class="movie__actions" v-if="userLoggedIn && favoriteChecked">
            <a href="#" class="movie__actions-link" :class="{'active' : favorite === true}" @click.prevent="toggleFavorite">
              <svg class="movie__actions-icon" :class="{'waiting' : favorite === ''}">
                <use xlink:href="#iconFavorite"></use>
              </svg>
              <span class="movie__actions-text" v-if="favorite === ''">Wait...</span>
              <span class="movie__actions-text" v-else-if="favorite">Marked as Favorite</span>
              <span class="movie__actions-text" v-else>Mark as Favorite?</span>
            </a>
          </div>
          <div class="movie__info">
            <div v-if="movie.overview" class="movie__description">
              {{ movie.overview }}
            </div>
            <div class="movie__details">
              <div v-if="movie.genres.length" class="movie__details-block">
                <h2 class="movie__details-title">
                  Genres
                </h2>
                <div class="movie__details-text">
                  {{ nestedDataToString(movie.genres) }}
                </div>
              </div>
              <div v-if="movie.release_date" class="movie__details-block">
                <h2 class="movie__details-title">
                  Release Date
                </h2>
                <div class="movie__details-text" v-formatDate="movie.release_date"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import img from '../directives/v-image.js'
import formatDate from '../directives/v-formatDate.js'

export default {
  props: ['id', 'type'],
  directives: {
    img: img,
    formatDate: formatDate
  },
  data(){
    return{
      movie: {},
      movieLoaded: false,
      moviePosterSrc: '',
      movieBackdropSrc: '',
      userLoggedIn: storage.sessionId ? true : false,
      favoriteChecked: false,
      favorite: ''
    }
  },
  // computed: {
  //   loaded(){
  //     return this.movieLoaded ? true : false;
  //   }
  // },
  methods: {
    fetchMovie(id){
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${storage.apiKey}&language=en-US`)
      .then(function(resp){
          let movie = resp.data;
          this.movie = movie;
          this.poster();
          this.backdrop();
          if(this.userLoggedIn){
            this.checkIfInFavorites(movie.id);
          } else {
            this.movieLoaded = true;
          }
          // Push state
          if(storage.createMoviePopup){
            storage.moviePath = '/movie/' + id;
            history.pushState({ popup: true }, null, storage.moviePath);
            storage.createMoviePopup = false;
          }
          // Change Page title
          document.title = this.movie.title + storage.pageTitlePostfix;
      }.bind(this))
      .catch(function(error) {
        this.$router.push({ name: '404' });
      }.bind(this));
    },
    poster() {
      if(this.movie.poster_path){
        this.moviePosterSrc = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.movie.poster_path;
      }
    },
    backdrop(){
      if(this.movie.backdrop_path){
        this.movieBackdropSrc = 'https://image.tmdb.org/t/p/w500' + this.movie.backdrop_path;
      }
    },
    nestedDataToString(data) {
      let nestedArray = [], resultString;
      data.forEach((item) => nestedArray.push(item.name));
      resultString = nestedArray.join(', ');
      return resultString;
    },
    checkIfInFavorites(id){
      axios.get(`https://api.themoviedb.org/3/movie/${id}/account_states?api_key=${storage.apiKey}&session_id=${storage.sessionId}`)
      .then(function(resp){
          this.favorite = resp.data.favorite;
          this.favoriteChecked = true;
          this.movieLoaded = true;
      }.bind(this))
    },
    toggleFavorite(){
      let favoriteInvert = !this.favorite;
      this.favorite = '';
      axios.post(`https://api.themoviedb.org/3/account/${storage.userId}/favorite?api_key=${storage.apiKey}&session_id=${storage.sessionId}`, {
        'media_type': 'movie',
        'media_id': this.id,
        'favorite': favoriteInvert
      })
      .then(function(resp){
        this.favorite = favoriteInvert;
        eventHub.$emit('updateFavorite');
      }.bind(this));
    }
  },
  watch: {
    id: function(val){
      this.fetchMovie(val);
    }
  },
  created(){
    this.fetchMovie(this.id);
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.movie{
  &__wrap{
    display: flex;
    &--page{
      max-width: 768px;
      position: relative;
      margin: 0 auto;
    }
    &--header{
      align-items: center;
      height: 100%;
    }
    &--main{
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      @include tablet-min{
        flex-direction: row;
      }
    }
  }
  &__header{
    height: 250px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: $c-dark;
    @include tablet-min{
      height: 350px;
      &--page{
        height: 384px;
      }
    }
    &:before{
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background: rgba($c-dark, 0.85);
    }
  }
    &__poster{
      display: none;
      @include tablet-min{
        background: $c-dark;
        display: block;
        position: absolute;
        width: calc(45% - 40px);
        top: 40px;
        left: 40px;
      }
    }
      &__img{
        display: block;
        width: 100%;
        opacity: 0;
        transform: scale(0.97) translateZ(0);
        transition: opacity 0.5s ease, transform 0.5s ease;
        &.is-loaded{
          opacity: 1;
          transform: scale(1);
        }
      }
    &__title{
      position: relative;
      padding: 20px;
      color: $c-green;
      text-align: center;
      width: 100%;
      @include tablet-min{
        width: 55%;
        text-align: left;
        margin-left: 45%;
        padding: 30px 30px 30px 40px;
      }
      &-text{
        font-weight: 500;
        line-height: 1.4;
        font-size: 24px;
        @include tablet-min{
          font-size: 30px;
        }
        span{
          display: block;
          font-size: 14px;
          font-weight: 300;
          color: rgba($c-white, 0.7);
          margin-top: 10px;
        }
      }
    }
  &__main{
    background: $c-light;
    min-height: calc(100vh - 250px);
    @include tablet-min{
      min-height: 0;
    }
  }
    &__actions{
      text-align: center;
      width: 100%;
      order: 2;
      padding: 20px;
      border-top: 1px solid rgba($c-dark, 0.05);
      @include tablet-min{
        order: 1;
        width: 45%;
        padding: 185px 0 40px 40px;
        border-top: 0;
      }
      &-link{
        display: flex;
        align-items: center;
        text-decoration: none;
        text-transform: uppercase;
        color: rgba($c-dark, 0.5);
        transition: color 0.5s ease;
        font-size: 11px;
        padding: 10px 0;
        border-bottom: 1px solid rgba($c-dark, 0.05);
        &:hover{
          color: rgba($c-dark, 0.75);
        }
        &.active{
          color: $c-dark;
        }
      }
      &-icon{
        width: 16px;
        height: 16px;
        margin: 0 10px 0 0;
        fill: rgba($c-dark, 0.5);
        transition: fill 0.5s ease, transform 0.5s ease;
        &.waiting{
          transform: scale(0.8, 0.8);
        }
      }
      &-link:hover &-icon{
        fill: rgba($c-dark, 0.75);
      }
      &-link.active &-icon{
        fill: $c-green;
      }
      &-text{
        display: block;
        padding-top: 2px;
      }
    }
    &__info{
      width: 100%;
      padding: 20px;
      order: 1;
      @include tablet-min{
        order: 2;
        padding: 40px;
        width: 55%;
        margin-left: 45%;
      }
    }
    &__actions + &__info{
      margin-left: 0;
    }
      &__description{
        font-weight: 300;
        font-size: 13px;
        line-height: 1.8;
        margin-bottom: 20px;
        @include tablet-min{
          margin-bottom: 30px;
          font-size: 14px;
        }
      }
      &__details{
        &-block:not(:last-child){
          margin-bottom: 20px;
          @include tablet-min{
            margin-bottom: 30px;
          }
        }
        &-title{
          margin: 0;
          font-weight: 400;
          text-transform: uppercase;
          font-size: 14px;
          color: $c-green;
          @include tablet-min{
            font-size: 16px;
          }
        }
        &-text{
          font-weight: 300;
          font-size: 14px;
          margin-top: 5px;
        }
      }
}
</style>
