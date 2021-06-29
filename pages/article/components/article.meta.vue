<template>
  <div class="article-meta">
    <nuxt-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
      ><img :src="article.author.image" v-if="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{ name: 'profile', params: { username: article.author.username } }"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM/DD YYYY") }}</span>
    </div>
    <template v-if="isAuthor">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="'/editArticle/' + article.slug"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ disabled: isDeleting }"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button class="btn btn-sm btn-outline-secondary" @click="onFollow">
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "UnFollow" : "Follow" }}
        {{ article.author.username }}
        <span class="counter"></span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import Article from "@/services/articles";
import ProfileApi from "@/services/profile";
import Favorite from "@/services/favorite";

export default {
  name: "article-meta",
  props: ["article"],
  data() {
    return {
      isDeleting: false,
    };
  },
  computed: {
    isAuthor() {
      return this.article.author.username === this.$store.state.user.username;
    },
  },

  methods: {
    async deleteArticle() {
      if (this.isAuthor) {
        try {
          await Article.deleteArticle(this.article.slug);
          this.$router.go(-1);
        } catch (error) {
          this.$toast.error(error.message);
        }
      }
    },
    async onFollow() {
      if (this.article.author.username === this.$store.state.user.username)
        return;
      try {
        if (this.article.author.following) {
          await ProfileApi.unFollow(this.article.author.username);
          this.article.author.following = false;
        } else {
          await ProfileApi.follow(this.article.author.username);
          this.article.author.following = true;
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    async onFavorite() {
      if (this.article.author.username === this.$store.state.user.username)
        return;
      try {
        if (this.article.favorited) {
          await Favorite.deleteFavorite(this.article.slug);
          this.article.favorited = false;
          this.article.favoritesCount--;
        } else {
          await Favorite.addFavorite(this.article.slug);
          this.article.favorited = true;
          this.article.favoritesCount++;
        }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
  },
};
</script>

<style>
</style>