<template>
  <div id="app">
    <navigation></navigation>
    <header class="header">
      <div class="header__search">
        <input class="header__search-input" type="text" v-model.trim="searchQuery" @keyup.enter="search" @blur="search" placeholder="Search for a movie...">
        <svg class="header__search-icon">
          <use xlink:href="#iconSearch"></use>
        </svg>
      </div>
    </header>

      <movie-popup v-if="moviePopupIsVisible" @close="closeMoviePopup" :id="moviePopupId"></movie-popup>

    <section class="main">
      <transition name="fade" @after-leave="afterLeave">
        <router-view name="list-router-view" :type="'page'" :mode="'collection'" :key="$route.params.category"></router-view>
        <router-view name="search-router-view" :type="'page'" :mode="'search'" :key="$route.params.query"></router-view>
        <router-view name="page-router-view"></router-view>
      </transition>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import storage from './storage.js'
import Navigation from './components/Navigation.vue'
import MoviePopup from './components/MoviePopup.vue'

export default {
  name: 'app',
  components: { Navigation, MoviePopup},
  data(){
    return{
      moviePopupIsVisible: false,
      moviePopupHistoryVisible: false,
      moviePopupId: 0,
      searchQuery: ''
    }
  },
  computed: {
    queryForRouter(){
      return encodeURI(this.searchQuery.replace(/ /g, "+"));
    }
  },
  methods: {
    // User Session Methods
    requestToken(){
      storage.sessionId = null;
      axios.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${storage.apiKey}`)
      .then(function(resp){
          if(typeof resp.data == 'string') {
             resp.data = JSON.parse(resp.data);
          }
          let data = resp.data;
          window.location.href = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${location.protocol}//${location.host}/profile`
      }.bind(this));
    },
    setUserStatus(){
      storage.sessionId = localStorage.getItem('session_id') || null;
      storage.userId = localStorage.getItem('user_id') || null;
    },
    // Movie Popup Methods
    openMoviePopup(id, newMoviePopup){
      if(newMoviePopup){
        storage.backTitle = document.title;
      }
      storage.createMoviePopup = newMoviePopup;
      this.moviePopupIsVisible = true;
      this.moviePopupId = id;
      document.querySelector('body').classList.add('hidden');
    },
    closeMoviePopup(){
      storage.createMoviePopup = false;
      this.moviePopupIsVisible = false;
      document.querySelector('body').classList.remove('hidden');
      window.history.back();
    },
    onHistoryState(e){
      storage.moviePopupOnHistory = e.state ? e.state.hasOwnProperty('popup') : false;
      if(!storage.moviePopupOnHistory){
        this.moviePopupIsVisible = false;
        document.title = storage.backTitle;
      }
    },
    changeHistoryState(){
      if(history.state && history.state.popup){
        let newState = {
          popup: false
        };
        history.replaceState(newState , null, storage.moviePath);
      }
    },
    // Search Methods
    search(){
      if(!this.searchQuery.length) return;
      this.$router.push({ name: 'search', params: { query: this.queryForRouter }});
    },
    setSearchQuery(clear){
      if(clear){
        this.searchQuery = '';
      } else {
        let query = decodeURIComponent(this.$route.params.query);
        this.searchQuery =  query ? query.replace(/\+/g, " ") : '';
      }
    },
    // Router After Leave
    afterLeave(){
      document.querySelector('body').scrollTop = 0;
    },
    // Detect if touch device
    isTouchDevice() {
      return 'ontouchstart' in document.documentElement;
    }
  },
  created(){
    window.addEventListener('popstate', this.onHistoryState);
    window.addEventListener('pagehide', this.changeHistoryState);
    eventHub.$on('openMoviePopup', this.openMoviePopup);
    eventHub.$on('setSearchQuery', this.setSearchQuery);
    eventHub.$on('requestToken', this.requestToken);
    eventHub.$on('setUserStatus', this.setUserStatus);
    if (this.isTouchDevice()) {
      document.querySelector('body').classList.add('touch');
    }
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
*{
  box-sizing: border-box;
}
html, body{
  height: 100%;
}
body{
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  background: $c-light;
  color: $c-dark;
  &.hidden{
    overflow: hidden;
  }
}
input, textarea, button{
  font-family: 'Roboto', sans-serif;
}
figure{
  padding: 0;
  margin: 0;
}
img{
  display: block;
  max-width: 100%;
  height: auto;
}
.loader{
  animation: load 1s linear infinite;
  border: 2px solid $c-white;
  border-radius: 50%;
  display: block;
  height: 30px;
  left: 50%;
  margin: -1.5em;
  position: absolute;
  top: 50%;
  width: 30px;
  &:after {
    border: 5px solid $c-green;
    border-radius: 50%;
    content: '';
    left: 10px;
    position: absolute;
    top: 16px;
  }
}
@keyframes load {
  100% { transform: rotate(360deg); }
}
.wrapper{
  position: relative;
}
.header{
  position: fixed;
  background: $c-white;
  z-index: 15;
  display: flex;
  @include tablet-min{
    width: calc(100% - 170px);
    height: 75px;
    margin-left: 95px;
    border-top: 0;
    border-bottom: 0;
    top: 0;
  }
  &__search{
    height: 50px;
    display: flex;
    position: relative;
    z-index: 5;
    width: calc(100% - 110px);
    position: fixed;
    top: 0;
    right: 55px;
    @include tablet-min{
      position: relative;
      height: 75px;
      right: 0;
    }
    &-input{
      display: block;
      width: 100%;
      padding: 15px 20px 15px 45px;
      outline: none;
      border: 0;
      background-color: transparent;
      color: $c-dark;
      font-weight: 300;
      font-size: 16px;
      @include tablet-min{
        padding: 15px 30px 15px 60px;
      }
      @include tablet-landscape-min{
        padding: 15px 30px 15px 80px;
      }
      @include desktop-min{
        padding: 15px 30px 15px 90px;
      }
    }
    &-icon{
      width: 14px;
      height: 14px;
      fill: rgba($c-dark, 0.5);
      transition: fill 0.5s ease;
      pointer-events: none;
      position: absolute;
      top: 50%;
      margin-top: -7px;
      left: 20px;
      @include tablet-min{
        width: 18px;
        height: 18px;
        margin-top: -9px;
        left: 30px;
      }
      @include tablet-landscape-min{
        left: 50px;
      }
      @include desktop-min{
        left: 60px;
      }
    }
    &-input:focus + &-icon{
      fill: $c-dark;
    }
  }
}
.main{
  position: relative;
  padding: 50px 0 0;
  @include tablet-min{
    width: calc(100% - 95px);
    padding: 75px 0 0;
    margin-left: 95px;
    position: relative;
  }
}
.button{
  display: inline-block;
  border: 1px solid $c-dark;
  text-transform: uppercase;
  background: $c-dark;
  font-weight: 300;
  font-size: 11px;
  line-height: 2;
  letter-spacing: 0.5px;
  padding: 5px 20px 4px 20px;
  cursor: pointer;
  color: $c-dark;
  background: transparent;
  outline: none;
  transition: background 0.5s ease, color 0.5s ease;
  @include tablet-min{
    font-size: 12px;
    padding: 6px 20px 5px 20px;
  }
  body:not(.touch) &:hover{
    background: $c-dark;
    color: $c-white;
  }
}


// router view transition
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}
.fade-enter-active {
  transition-delay: 0.25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
