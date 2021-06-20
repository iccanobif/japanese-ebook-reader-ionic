<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <input type="file" id="file-input" />
      <div id="ebook-viewer">
        <div v-for="(line, lineIndex) in text.split('\n')" :key="lineIndex">
          <span
            v-for="(character, characterIndex) in line.split('')"
            :key="characterIndex"
            v-on:click="onCharacterClick(line, characterIndex)"
          >
            {{ character }}
          </span>
        </div>
      </div>
      <div class="button-bar">
        <button id="openFile" v-on:click="openNewFile()" style="flex-grow: 1">
          A
        </button>
        <button id="btnPageUp" style="flex-grow: 1">⇑</button>
        <button id="btnScrollUp" style="flex-grow: 4">↑</button>
        <button id="btnScrollDown" style="flex-grow: 4">↓</button>
        <button id="btnPageDown" style="flex-grow: 1">⇓</button>
      </div>
      <div id="completion-indicator"></div>
      <iframe
        id="integrated-japanese-dictionary-popup"
        src="https://japanese-dictionary-iframe.herokuapp.com"
      >
      </iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { defineComponent } from "vue";
import { text } from "../haruhi01";
import { FileChooser } from "@ionic-native/file-chooser";
import { File, IFile } from "@ionic-native/file";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      loadingText: false,
      // text: "もしかして世のブログって皆金掛かってると思ってたのか",
      text: text,
    };
  },
  async mounted() {
    (async function () {
      console.log("opening");
      const uri = await FileChooser.open();

      console.log("uri", uri);
      console.log("File.dataDirectory", File.dataDirectory);
      const entry = await File.resolveLocalFilesystemUrl(uri);
      console.log("entry", entry);

      console.log("entry.fullPath", entry.fullPath);

      // "/com.android.providers.downloads.documents/document/6451"

      try {
        File.readAsArrayBuffer(
          "/com.android.providers.downloadsfdsfdsfsdf.documents/document/",
          "6451 zzz "
        )
          .then((value) => {
            console.log(value);
          })
          .catch((err) => console.error(err));
      } catch (exc) {
        console.error(exc);
      }
    });

    const viewer = document.getElementById("ebook-viewer");
    const completionIndicator = document.getElementById("completion-indicator");
    const btnPageUp = document.getElementById("btnPageUp");
    const btnScrollUp = document.getElementById("btnScrollUp");
    const btnScrollDown = document.getElementById("btnScrollDown");
    const btnPageDown = document.getElementById("btnPageDown");

    let scrollSpeed = 0;
    let scrollFramesToSkip = 3;

    function scroll(amount: number) {
      viewer.scrollBy({ top: amount, left: 0 });
      window.localStorage.setItem("scroll-top", viewer.scrollTop.toString());
    }

    const pageUp = (ev) => {
      ev.preventDefault();
      scroll((scrollSpeed = -200));
    };
    const scrollUp = (ev) => {
      ev.preventDefault();
      scroll((scrollSpeed = -20));
    };
    const scrollDown = (ev) => {
      ev.preventDefault();
      scroll((scrollSpeed = 20));
    };
    const pageDown = (ev) => {
      ev.preventDefault();
      scroll((scrollSpeed = 200));
    };
    const stopScrolling = (ev) => {
      ev.preventDefault();
      scrollSpeed = 0;
      scrollFramesToSkip = 3;
    };

    btnPageUp.addEventListener("touchstart", pageUp);
    btnPageUp.addEventListener("mousedown", pageUp);
    btnPageUp.addEventListener("touchend", stopScrolling);
    btnPageUp.addEventListener("mouseup", stopScrolling);

    btnScrollUp.addEventListener("touchstart", scrollUp);
    btnScrollUp.addEventListener("mousedown", scrollUp);
    btnScrollUp.addEventListener("touchend", stopScrolling);
    btnScrollUp.addEventListener("mouseup", stopScrolling);

    btnScrollDown.addEventListener("touchstart", scrollDown);
    btnScrollDown.addEventListener("mousedown", scrollDown);
    btnScrollDown.addEventListener("touchend", stopScrolling);
    btnScrollDown.addEventListener("mouseup", stopScrolling);

    btnPageDown.addEventListener("touchstart", pageDown);
    btnPageDown.addEventListener("mousedown", pageDown);
    btnPageDown.addEventListener("touchend", stopScrolling);
    btnPageDown.addEventListener("mouseup", stopScrolling);

    window.addEventListener("keydown", (ev) => {
      if (ev.repeat) return;
      switch (ev.key) {
        case "ArrowDown":
          scrollDown(ev);
          break;
        case "ArrowUp":
          scrollUp(ev);
          break;
        case "PageDown":
          pageDown(ev);
          break;
        case "PageUp":
          pageUp(ev);
          break;
      }
    });

    window.addEventListener("keyup", (ev) => {
      stopScrolling(ev);
    });

    function updateCompletionIndictator() {
      if (!viewer.scrollHeight) completionIndicator.innerText = "0%";
      else
        completionIndicator.innerText =
          Math.round((viewer.scrollTop / viewer.scrollHeight) * 1000) / 10 +
          "%";
    }

    setInterval(() => {
      const scrollPositionFromStorage =
        window.localStorage.getItem("scroll-top");

      // If the app has just been opened but the saved scroll position still hasn't been applied, apply it.
      if (scrollPositionFromStorage && !viewer.scrollTop) {
        viewer.scrollTo({ top: Number(scrollPositionFromStorage), left: 0 });
        updateCompletionIndictator();
      }

      if (scrollSpeed != 0) {
        if (scrollFramesToSkip > 0) scrollFramesToSkip--;
        else {
          scroll(scrollSpeed);
          updateCompletionIndictator();
        }
      }
    }, 50);
  },
  methods: {
    onCharacterClick(text: string, index: number) {
      console.log(text, index);

      const selection = window.getSelection();

      console.log(selection);

      let offset = index;

      if (offset > 50) {
        text = text.substring(offset - 25, offset + 25);
        offset = 25;
      } else {
        text = text.substring(0, 100);
      }

      const popup = document.getElementById(
        "integrated-japanese-dictionary-popup"
      ) as HTMLIFrameElement;
      popup.contentWindow.postMessage(
        { text, offset },
        "https://japanese-dictionary-iframe.herokuapp.com"
      );
    },
    async openNewFile() {
      console.log("opening");
      const element = document.getElementById("file-input") as HTMLInputElement;

      const file = element.files[0];

      if (!file) {
        alert("seleziona un file");
        return;
      }

      console.log(file);

      const reader = new FileReader();

      reader.onloadend = function () {
        console.log("Successful file read: " + this.result);
        // displayFileData(fileEntry.fullPath + ": " + this.result);
      };
      reader.onerror = (ev) => {
        console.error(ev);
      };

      reader.readAsText(file);

      // const reader = new FileReader();
      // reader.addEventListener('load', (event) => {
      //     // img.src = event.target.result;
      //     console.log(event)
      //   });
      // reader.readAsArrayBuffer(file);

      // const uri = await FileChooser.open();

      // console.log(uri);
      // console.log(File.dataDirectory);
      // const entry = await File.resolveLocalFilesystemUrl(uri);
      // console.log(entry);
      // const reader = new FileReader()
      // const string = await File.readAsText(uri, "nomefile.txt")
      // reader.readAsText(, "utf8")
    },
  },
});
</script>

<style scoped>
#ebook-viewer {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: #000000;
  color: white;

  white-space: pre-wrap;
  overflow-wrap: break-word;
  position: fixed;
  top: 50%;
  left: 0;
  width: calc(100% - 30px);
  height: 50%;
  overflow: hidden;
  z-index: -1;
  font-size: larger;
}

.button-bar {
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 30px;
  position: fixed;
  right: 0;
  top: 50%;
}

.button-bar button {
  border: 0;
  padding: 0;
}

#completion-indicator {
  color: white;
  position: fixed;
  top: 50%;
  right: 30px;
  background-color: black;
}

#integrated-japanese-dictionary-popup {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0px;
  width: 100%;
  height: 50%;
  border-top: 0;
  border-left: 0;
  border-bottom: solid 2px;
  border-right: 0;
  z-index: 10;
  background-color: black;
}

input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}
</style>


