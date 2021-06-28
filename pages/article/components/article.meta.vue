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
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          article: article.author.following,
        }"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ article.author.username }}
        <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
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
    async deleteArticle() {},
  },
};
</script>

<style>
</style>