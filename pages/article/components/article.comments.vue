<template>
  <div>
    <form class="card comment-form" @submit.prevent="postComment">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="comment"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="$store.state.user.image"
          v-if="$store.state.user.image"
          class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          <img
            :src="comment.author.image"
            v-if="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
          >{{ comment.author.username }}</nuxt-link
        >
        <span class="date-posted">{{
          comment.createdAt | date("MMM/DD YYYY")
        }}</span>
        <span
          class="mod-options"
          v-if="comment.author.username === $store.state.user.username"
        >
          <i class="ion-trash-a" @click.prevent="deleteComment(comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleApi from "@/services/articles.js";

export default {
  name: "article-comments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      comment: "",
    };
  },
  async mounted() {
    this.loadComments();
  },
  methods: {
    async loadComments() {
      const { data } = await ArticleApi.getComments(this.article.slug);
      this.comments = data.comments;
    },
    async postComment() {
      if (this.comment.length) {
        try {
          await ArticleApi.postComment(this.article.slug, {
            comment: {
              body: this.comment,
            },
          });
          await this.loadComments();
          this.comment = "";
        } catch (error) {
          this.$toast.error(error.message);
        }
      } else {
        this.$toast.info("comment can't be empty");
      }
    },
    async deleteComment(id) {
      try {
        await ArticleApi.deleteComment(this.article.slug, id);
        const i = this.comments.findIndex((n) => n.id === id);
        if (i > -1) {
          this.comments.splice(i, 1);
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