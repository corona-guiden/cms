<script>
  import appConfig from '@src/app.config'
  import * as Diff from 'diff'
  import DiffMatchPatch from 'diff-match-patch';
  import http from '@utils/http'
  import VueMarkdown from 'vue-markdown'

  export default {
    components: { VueMarkdown },
    page: {
      title: 'Home',
      meta: [{name: 'description', content: appConfig.description}],
    },
    data() {
      return {
        markdown1: ``,
        markdown2: "**Tänk över om resorna verkligen är nödvändig**\n---------------------------------------------\n\nMed anledningen av spridningen av coronaviruset rekommenderar [Folkhälsomyndigheten ](https://www.folkhalsomyndigheten.se/nyheter-och-press/nyhetsarkiv/2020/mars/tank-over-om-resan-verkligen-ar-nodvandig/)alla att tänka igenom om planerade helgresor eller andra resor inom Sverige verkligen är nödvändiga att genomföra. Den som är sjuk ska inte resa alls.\n\nDet är viktigt att tänka på att man ska kunna ta hand om sig själv om man skulle bli sjuk medan man är på resa. Behöver du hjälp lokalt ska man vara medveten om att det kan finnas begränsat med resurser. Se också till att du kan ta dig hem själv på ett säkert sätt utan att riskera att smitta andra.\n\nVad gäller för inrikes resor och kollektivtrafik?\n-------------------------------------------------\n\nMånga trafikföretag har information på sina webbplatser om situationen kring det nya coronaviruset. För information om linjer eller sträckor som du ska resa, besök den aktuella webbplatsen.\n\n- [Trafikverkets arbete med anledning av det nya coronaviruset](https://www.trafikverket.se/om-oss/var-verksamhet/sa-har-jobbar-vi-med/trafikverkets-forhallningssatt-till-coronaviruset/)\n- [Swedavias samlade <span>reseinformation med anledning av det nya coronaviruset</span>](https://www.swedavia.se/arlanda/reseinformation-med-anledning-av-coronavirus/)\n- [Länsstyrelsen i Norrbotten om begränsningar för resor till Finland och Norge](https://www.lansstyrelsen.se/norrbotten/om-oss/nyheter-och-press/nyheter---norrbotten/2020-03-14-skarpta-granskontroller-i-norden.html)\n- [SJ om inställda avgångar och reducerad trafik](https://www.sj.se/sv/om/om-sj/senaste-info-coronavirus-o-tagresor.html)\n- [Skånetrafiken om bland annat resor till Danmark](https://www.skanetrafiken.se/nyhetsarkiv/aterlosen-biljetter/)\n- [Storstockholms lokaltrafik (SL) om nya rutiner i kollektivtrafiken](https://sl.se/sv/info/nyheter/corona/corona/)\n- [<span>Västtrafiks information med anledning av det nya coronaviruset </span>](https://www.vasttrafik.se/info/corona/)\n\nTänk på detta innan du åker tåg, buss eller taxi:\n-------------------------------------------------\n\n- Följ alltid de allmänna råden om hur du skyddar dig själv och andra. Stanna hemma om du är sjuk, tvätta händerna ofta, hosta och nys i arvecket och undvik att röra vid ögon, näsa och mun.\n- Håll avstånd till andra resenärer.\n- Tvätta alltid händerna efter resa. Handsprit kan vara ett alternativ när du inte har möjlighet till handtvätt.\nLorem ipsum dolor",
        output: '',
        diff: '',
      }
    },
    mounted() {
      http.get('test').then(res => {
        this.jsDiff(res.data)
        // this.googleDiff()
      })
    },
    methods: {
      googleDiff() {
        const dmp = new DiffMatchPatch();
        this.diff = dmp.diff_main(this.markdown1, this.markdown2, true);

        console.log(this.diff)

        this.diff.forEach((part) => {
          if (part[0] === 0) {
            this.output += part[1]
          }

          if (part[0] === 1) {
            this.output += `<span style="color: green">${part[1]}</span>`
          }

          if (part[0] === -1) {
            this.output += `<span style="color: red">${part[1]}</span>`
          }
        })
      },
      jsDiff(text) {
        this.markdown1 = text
        this.diff = Diff.diffWords(this.markdown1, this.markdown2)

        this.diff.forEach((part) => {
          if (!part.added && !part.removed) {
            this.output += part.value
          }

          if (part.added) {
            this.output += `<span style="color: green">${part.value}</span>`
          }

          if (part.removed) {
            this.output += `<span style="color: red">${part.value}</span>`
          }
        });
      }
    },
  }
</script>

<template>
  <div>
    <h1>Home Page</h1>

    <VueMarkdown html :source="output">this is the default slot</VueMarkdown>

  </div>
</template>
