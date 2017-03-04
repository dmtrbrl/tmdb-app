<template>
  <section class="not-found">
    <div class="not-found__content">
      <h2 class="not-found__title">Page Not Found</h2>
    </div>
  </section>
</template>

<script>
import storage from '../storage.js'
export default {
  created(){
    document.title = 'Page Not Found' + storage.pageTitlePostfix;
  }
}
</script>

<style lang="scss">
@import "./src/scss/variables";
@import "./src/scss/media-queries";
.not-found{
  width: 100%;
  height: calc(100vh - 100px);
  background: url('~assets/pulp-fiction.jpg') no-repeat 50% 50%;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @include tablet-min{
    height: calc(100vh - 75px);
  }
  &:before{
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($c-light, 0.7);
  }
  &__content{
    width: 100%;
    padding: 0 20px;
    text-align: center;
    @include tablet-min{
      padding: 0 40px 40px 0;
    }
  }
    &__title{
      font-size: 24px;
      font-weight: 500;
      color: $c-dark;
      position: relative;
      margin: 0;
      @include tablet-min{
        font-size: 28px;
      }
    }
    &__button{
      position: relative;
      margin-top: 20px;
    }
}
</style>
