
<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page">
        <ul class="book-list">
          <li
            v-for="(book, index) in settings?.books"
            v-bind:key="book.uri"
            v-on:click="bookSelected(index)"
          >
            {{ book.fileName }}
          </li>
        </ul>
        <button v-on:click="openFile()">Open</button>
        <button v-on:click="clearList()">Clear list</button>
      </div>
    </ion-content>
  </ion-page>
</template>



<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { FileChooser } from "@ionic-native/file-chooser";
import { FilePath } from "@ionic-native/file-path";
import { BookSettings, getPersistedSettings, persistSettings } from "@/settings";

export default defineComponent({
  name: "BookSelection",
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      settings: getPersistedSettings(),
    };
  },
  methods: {
    async openFile() {
      const uri = await FileChooser.open();

      const fullPath = await FilePath.resolveNativePath(uri);
      const fileName = fullPath.substring(fullPath.lastIndexOf("/") + 1);

      const existingBook = this.settings.books.find((b) => b.uri == uri);
      if (!existingBook) {
        this.settings.books.push({
          uri: uri,
          fileName,
          scrollTop: 0,
        });
        persistSettings(this.settings);
      }
    },
    bookSelected(index: number) {
      console.log("bookSelected, index:", index)

      this.$router.push({ path: "/reader/" + index });
    },
    clearList() {
      console.log("clearing book list");
      this.settings = { books: [] };
      persistSettings(this.settings);
    },
  },
});
</script>

<style scoped>
.book-list {
  padding: 0px;
}
.book-list li {
  padding: 5px;
  background-color: green;
  list-style: none;
}
</style>
