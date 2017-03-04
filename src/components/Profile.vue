<template>
  <section class="profile">
    <div class="profile__content" v-if="userLoggedIn === true">
      <header class="profile__header">
        <h2 class="profile__title">Hello {{ userName }}</h2>
        <button class="button" @click="logOut">Log Out</button>
      </header>
      <movies-list :type="'component'" :mode="'favorite'"></movies-list>
      <!-- <created-lists></created-lists> -->
    </div>
    <section class="not-found" v-if="userLoggedIn === false">
      <div class="not-found__content">
        <h2 class="not-found__title">Authentication Request Failed</h2>
        <button class="not-found__button button" @click="requestToken">Log In</button>
      </div>
    </section>
  </section>
</template>

<script>
import axios from 'axios'
import storage from '../storage.js'
import MoviesList from './MoviesList.vue'
// import CreatedLists from './CreatedLists.vue'

export default {
  components: { MoviesList },
  data(){
    return{
      userLoggedIn: '',
      userName: ''
    }
  },
  methods: {
    requestPermission(){
      let query = location.search.substring(1);
      if(query.length){
        let params = query.split('&');
        let token = params[0].split('=')[1];
        let status = params[1].split('=')[0];
        if(status == 'approved'){
          this.createSession(token);
        } else {
          this.userLoggedIn = false;
        }
      } else {
        this.userLoggedIn = false;
      }
    },
    createSession(token){
      axios.get(`https://api.themoviedb.org/3/authentication/session/new?api_key=${storage.apiKey}&request_token=${token}`)
      .then(function(resp){
          let data = resp.data;
          if(data.success){
            let id = data.session_id;
            localStorage.setItem('session_id', id);
            eventHub.$emit('setUserStatus');
            this.userLoggedIn = true;
            this.getUserInfo();
          }
      }.bind(this));
    },
    getUserInfo(){
      axios.get(`https://api.themoviedb.org/3/account?api_key=${storage.apiKey}&session_id=${storage.sessionId}`)
      .then(function(resp){
          let data = resp.data;
          this.userName = data.username;
          if (!localStorage.getItem('user_id')) localStorage.setItem('user_id', data.id);
      }.bind(this))
      .catch(function (error) {
        this.logOut();
      }.bind(this));
    },
    requestToken(){
      eventHub.$emit('requestToken');
    },
    logOut(){
      localStorage.clear();
      eventHub.$emit('setUserStatus');
      this.$router.push({ name: 'home' });
    }
  },
  created(){
    document.title = 'Profile' + storage.pageTitlePostfix;
    storage.backTitle = document.title;
    if(!storage.sessionId){
      this.requestPermission();
    } else {
      this.userLoggedIn = true;
      this.getUserInfo();
    }
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.profile{
  &__content{
    .wrapper{
      min-height: calc(100vh - 175px);
      @include tablet-min{
        min-height: calc(100vh - 171px);
      }
    }
  }
  &__header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid rgba($c-dark, 0.05);
    @include tablet-min{
      padding: 29px 30px;
    }
    @include tablet-landscape-min{
      padding: 29px 50px;
    }
    @include desktop-min{
      padding: 29px 60px;
    }
  }
    &__title{
      margin: 0;
      font-size: 16px;
      line-height: 16px;
      color: $c-dark;
      font-weight: 300;
      @include tablet-min{
        font-size: 18px;
        line-height: 18px;
      }
    }
}
</style>
