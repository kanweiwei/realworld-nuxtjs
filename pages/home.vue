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
                  <a href="" class="author">{{ article.author.username }}</a>
                  <span class="date">{{ article.createdAt | date('MMM/DD YYYY') }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
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
          : ArticleApi.getAsync;
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
  },
};
</script>

<style>
</style>