<template>
  <ion-page>
    <!-- <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header> -->
    
    <ion-content :fullscreen="true">
  <div id="ebook-viewer" onclick="selectionChanged()">
サンタクロースをいつまで信じていたかなんてことはたわいもない世間話にもならないくらいのどうでもいいような話だが、
それでも俺がいつまでサンタなどという想像上の赤服じーさんを信じていたかと言うとこれは確信をもって言えるが最初から信じてなどいなかった。
幼稚園《ようちえん》のクリスマスイベントに現れたサンタは偽《にせ》サンタだと理解していたし、記憶《きおく》をたどると周囲にいた園児たちも
あれが本物だとは思っていないような目つきでサンタのコスプレをした園長先生を眺《なが》めていたように思う。そんなこんなでオフクロがサンタにキスして
いるところを目撃《もくげき》したわけでもないのにクリスマスにしか仕事をしないジジイの存在を疑っていた賢《さか》しい俺なのだが、宇宙人
や未来人や幽霊《ゆうれい》や妖怪《ようかい》や超能力《ちょうのうりょく》や悪の組織やそれらと戦うアニメ的｜
特撮《とくさつ》的漫画的ヒーローたちがこの世に存在しないのだということに気付いたのは相当後になってからだった。
いや、本当は気付いていたのだろう。ただ気付きたくなかっただけなのだ。俺は心の底から宇宙人や未来人や幽霊や妖怪
や超能力や悪の組織が目の前にふらりと出てきてくれることを望んでいたのだ。</div>
  <div class="button-bar">
    <button id="btnPageUp" style="flex-grow: 1;">⇑</button>
    <button id="btnScrollUp" style="flex-grow: 4;">↑</button>
    <button id="btnScrollDown" style="flex-grow: 4;">↓</button>
    <button id="btnPageDown" style="flex-grow: 1;">⇓</button>
  </div>
  <div id="completion-indicator">
  </div>
  <iframe id="integrated-japanese-dictionary-popup" src="https://japanese-dictionary-iframe.herokuapp.com">
  </iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    // IonHeader,
    IonPage,
    // IonTitle,
    // IonToolbar
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>