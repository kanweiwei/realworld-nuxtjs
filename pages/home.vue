<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  :class="{ active: tab == 'your_feed' }"
                  exact
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  :class="{ active: tab == 'global_feed' }"
                  exact
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="tab == 'tag'">
                <a class="nav-link" :class="{ active: tab == 'tag' }" href=""
                  >#{{ $route.query.tag }}</a
                >
              </li>
            </ul>
          </div>
          <span v-if="!loading && articles.length == 0">
            <p>No articles are here... yet.</p>
          </span>
          <template v-else
            ><div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  <!-- <img :src="article.author.image" v-if="article.author.image"
              /> -->
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    :to="{
                      name: 'profile',
                      params: {
                        username: article.author.username,
                      },
                    }"
                    class="author"
                    >{{ article.author.username }}</nuxt-link
                  >
                  <span class="date">{{
                    article.createdAt | date("MMM/DD YYYY")
                  }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click.stop.prevent="onFavorite(article)"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug,
                  },
                }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
            <!-- 分页列表 -->
            <nav>
              <ul class="pagination">
                <li
                  class="page-item"
                  v-for="pageNumber in pageRange(articlesCount)"
                  :key="pageNumber"
                  :class="{
                    active: pageNumber === page,
                  }"
                >
                  <nuxt-link
                    class="page-link"
                    :to="{
                      name: 'home',
                      query: {
                        page: pageNumber,
                        tag: $route.query.tag,
                        tab: tab,
                      },
                    }"
                    >{{ pageNumber }}</nuxt-link
                  >
                </li>
              </ul>
            </nav>
          </template>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: tag,
                    page: 1,
                    tab: 'tab',
                  },
                }"
                class="tag-pill tag-default"
                v-for="(tag, index) in tags"
                :key="index"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ArticleApi from "@/services/articles";
import TagApi from "@/services/tags";
import FavoriteApi from "@/services/favorite";

export default {
  name: "Home",
  computed: {
    ...mapState(["user"]),
  },
  async asyncData({ query, store }) {
    try {
      const page = query.page || 1;
      const tag = query.tag || "";
      const tab = query.tab || "global_feed";
      const getArticles =
        store.state.user && tab === "your_feed"
          ? ArticleApi.getFeedArticlesAsync
          : ArticleApi.getAllAsync;
      const limit = 20;
      const [articleRes, tagRes] = await Promise.all([
        getArticles({
          limit,
          offset: (page - 1) * limit,
          tag,
        }),
        TagApi.getAsync(),
      ]);

      return {
        page,
        articles: articleRes.data.articles,
        articlesCount: articleRes.data.articlesCount,
        tags: tagRes.data.tags,
        tab,
        loading: false,
      };
    } catch (error) {}
  },
  watchQuery: ["page", "tag", "tab"],
  methods: {
    pageRange(num) {
      return Math.max(Math.ceil(num / 20), 1);
    },
    onFavorite(article) {
      if (article.favorited) {
        FavoriteApi.deleteFavorite(article.slug)
          .then(({ data }) => {
            const i = this.articles.findIndex((n) => n.slug === article.slug);
            if (i > -1) {
              this.articles.splice(i, 1, data.article);
            }
          })
          .catch((err) => this.$toast.error(err.messaage));
      } else {
        FavoriteApi.addFavorite(article.slug)
          .then(({ data }) => {
            const i = this.articles.findIndex((n) => n.slug === article.slug);
            if (i > -1) {
              this.articles.splice(i, 1, data.article);
            }
          })
          .catch((err) => this.$toast.error(err.messaage));
      }
    },
  },
};
</script>

<style>
</style>