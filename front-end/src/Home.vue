<template>
  <div class="home-menu no-select">
    <RouterLink to="/">
      <h1>Stephan Vogler Artworks (2015)</h1>
    </RouterLink>
    <RouterLink to="/verifier">
      <h2 class="address-verifier-link">Address Verifier</h2>
    </RouterLink>
  </div>

  <div v-if="loadingCreations">Loading...</div>

  <div v-else-if="creationsErrorMessage">
    <h2>Something went wrong</h2>
    <p>{{ creationsErrorMessage }}</p>
  </div>

  <div v-else>
    <div class="creations-grid">
      <CreationTile
        v-for="creation in creations"
        :key="`creation-tile-${creation.h}`"
        :creation="creation"
      />
    </div>
    <div class="introduction">
      <p>
        On this website I present my works. They deal with questions about philosophy, information
        theory, art, law and economy.
      </p>
      <p>
        My works are immaterial. Every work is a file and has been electronically signed in
        compliance with the German Digital Signature Act. The electronic signature is equal to a
        written signature on a physical document. Additionally every signature contains a time
        stamp, proving that the file existed and was known to the signee at a specific time.
      </p>
      <p>
        The titles of the works are not arbitrary, random or time based. Instead they are SHA256
        hash values of the works' data. Every work is published under a license which transforms its
        usage rights using the bitcoin infrastructure into a immaterial good. The granting of the
        right to transfer the good is exclusive, that is legally limited to only one licensee. The
        immaterial good has following attributes:
      </p>
      <p style="margin-bottom: 0">
        In spite of its immaterial nature, the good is legally and technically limited and
        independently transferable respectively tradable.
      </p>
      <p style="margin: 0">
        The authenticity of the signature and the signature date of the work, the good is based on,
        can be proven beyond a reasonable doubt.
      </p>
      <p style="margin: 0">
        The acquisition of the good comes with more usage rights (e.g. the right to copy and to
        publish the good) than the acquisition of a material good.
      </p>
      <p style="margin: 0">
        The “ownership” of the immaterial good and the entitlement to the connected usage rights can
        be proven by the owner beyond a reasonable doubt.
      </p>
      <p style="margin: 0">
        The good can be securely and instantaneously sold or transferred worldwide with minimal
        transaction costs.
      </p>
      <p style="margin: 0">
        If the good is paid with Bitcoins it can be securely sold worldwide without the need for an
        escrow service.
      </p>
      <p>
        Hence the good has many attributes of a material good, but also additional attributes, like
        the possibility for a proof of authenticity of the signature beyond a reasonable doubt,
        which is impossible or very difficult for material works. Besides the good can also be based
        on a immaterial work like a piece of music.
      </p>
      <p>
        Because of the technical provisions of the license a list of my works can be found in the
        bitcoin block chain.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useCreations from './composables/useCreations'
import CreationTile from './CreationTile.vue'

const {
  creations, //
  creationsErrorMessage,
  loadingCreations,
  refreshCreations
} = useCreations()

onMounted(async () => {
  await refreshCreations({ refreshIfEmpty: true })
})
</script>

<style>
.home-menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
}

.address-verifier-link {
  cursor: pointer;
  text-align: right;
  padding-bottom: 3px;
}

.creations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  column-gap: 22px;
}

.creations-grid,
.introduction {
  max-width: 1760px;
}

.introduction {
  margin-top: 3rem;
}
</style>
