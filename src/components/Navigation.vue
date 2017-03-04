<template>
  <nav class="nav">
    <router-link class="nav__logo" :to="{name: 'home'}" exact title="Vue.js — TMDb App">
      <svg class="nav__logo-image">
        <use xlink:href="#svgLogo"></use>
      </svg>
    </router-link>
    <ul class="nav__list">
      <li class="nav__item" v-for="item in listTypes" v-if="item.isCategory">
        <router-link class="nav__link" :to="{name: 'home-category', params: {category: item.query}}">
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use :xlink:href="'#icon_' + item.query"></use>
            </svg>
            <span class="nav__link-title">{{ item.shortTitle }}</span>
          </div>
        </router-link>
      </li>
      <li class="nav__item nav__item--profile">
        <div  class="nav__link nav__link--profile"  @click="requestToken" v-if="!userLoggedIn">
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use xlink:href="#iconLogin"></use>
            </svg>
            <span class="nav__link-title">Log In</span>
          </div>
        </div>
        <router-link  class="nav__link nav__link--profile" :to="{name: 'profile'}" v-if="userLoggedIn">
          <div class="nav__link-wrap">
            <svg class="nav__link-icon">
              <use xlink:href="#iconLogin"></use>
            </svg>
            <span class="nav__link-title">Profile</span>
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import storage from '../storage.js'

export default {
  data(){
    return {
      listTypes: storage.listTypes,
      userLoggedIn: storage.sessionId ? true : false
    }
  },
  methods: {
    setUserStatus(){
      this.userLoggedIn = storage.sessionId ? true : false;
    },
    requestToken(){
      eventHub.$emit('requestToken');
    }
  },
  created(){
    eventHub.$on('setUserStatus', this.setUserStatus);
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.nav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: $c-white;
  display: flex;
  z-index: 10;
  @include tablet-min{
    display: block;
    width: 95px;
    height: 100vh;
  }
  &__logo{
    display: block;
    width: 55px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $c-dark;
    @include tablet-min{
      width: 95px;
      height: 75px;
    }
    &-image{
      width: 35px;
      height: 31px;
      fill: $c-green;
      transition: transform 0.5s ease;
      @include tablet-min{
        width: 45px;
        height: 40px;
      }
    }
    &:hover &-image{
      transform: scale(1.04);
    }
  }
  &__list{
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
    width: 100%;
    display: flex;
    position: fixed;
    left: 0;
    top: 50px;
    background: $c-white;
    border-top: 1px solid $c-light;
    @include tablet-min{
      background: transparent;
      position: relative;
      display: block;
      width: 100%;
      border-top: 0;
      top: 0;
    }
  }
  &__item{
    width: 20%;
    &:not(:first-child){
      border-left: 1px solid $c-light;
    }
    @include tablet-min{
      width: 100%;
      border-left: 0;
      border-bottom: 1px solid $c-light;
      &--profile{
        position: fixed;
        right: 0;
        top: 0;
        width: 75px;
        height: 75px;
        border-bottom: 0;
      }
    }
  }
  &__link{
    width: 100%;
    height: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 7px;
    font-weight: 300;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba($c-dark, 0.7);
    transition: color 0.5s ease, background 0.5s ease;
    position: relative;
    cursor: pointer;
    @include mobile-ls-min{
      font-size: 8px;
    }
    @include tablet-min{
      width: 95px;
      height: 95px;
      font-size: 9px;
      &--profile{
        width: 75px;
        height: 75px;
        background: $c-white;
      }
    }
    &-icon{
      width: 15px;
      height: 15px;
      margin-bottom: 3px;
      fill: rgba($c-dark, 0.7);
      transition: fill 0.5s ease;
      @include tablet-min{
        width: 20px;
        height: 20px;
        margin-bottom: 5px;
      }
    }
    &-title{
      display: block;
      width: 100%;
    }
    &:hover{
      color: $c-dark;
    }
    &:hover &-icon{
      fill: $c-dark;
    }
    &.is-active{
      color: $c-dark;
      background: $c-light;
    }
    &.is-active &-icon{
      fill: $c-dark;
    }
  }
}
</style>
