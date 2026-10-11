<template>
  <main class="privacy">
    <h1>Política de privacidad</h1>
    <p class="updated">Última actualización: octubre de 2026</p>

    <p>
      Andinismo de Escritorio es un proyecto sin fines de lucro que documenta la historia del
      andinismo. Esta página explica qué datos personales guardamos cuando creas una cuenta, para
      qué los usamos y qué puedes hacer con ellos.
    </p>

    <h2>Qué datos guardamos</h2>
    <ul>
      <li><strong>Tu correo:</strong> para entrar a tu cuenta y escribirte sobre ella (confirmación y recuperación de contraseña).</li>
      <li><strong>Tu nombre público:</strong> el que eliges al registrarte, para atribuirte tus aportes.</li>
      <li><strong>Tu contraseña,</strong> guardada cifrada: nadie, ni siquiera el equipo del sitio, puede leerla.</li>
      <li><strong>La fecha en que aceptaste esta política</strong> y, si la pides, la vinculación con tu ficha de andinista.</li>
      <li><strong>Datos técnicos de seguridad:</strong> la dirección IP de los intentos fallidos de inicio de sesión, para bloquear ataques. Se borran solos.</li>
    </ul>

    <h2>Qué se publica</h2>
    <p>
      Solo tu nombre público, junto a los aportes que hagas. Tu correo nunca se muestra en el sitio.
    </p>

    <h2>Con quién se comparten</h2>
    <p>
      Con nadie. No vendemos ni cedemos datos, no usamos publicidad ni seguimiento de terceros. Los
      correos de la cuenta se envían a través de un servicio de correo (como Gmail) y los datos se
      guardan en el servidor del sitio.
    </p>

    <h2>Cookies</h2>
    <p>
      Usamos solo las cookies necesarias para mantener tu sesión abierta y proteger los formularios.
      El mapa de la portada lo entrega Google Maps, que puede usar sus propias cookies.
    </p>

    <h2>Tus derechos</h2>
    <p>
      Puedes ver y cambiar tu nombre en <NuxtLink to="/mi-cuenta">Mi cuenta</NuxtLink>. Para pedir una
      copia de tus datos, corregirlos o eliminar tu cuenta, escríbenos a
      <strong>[correo de contacto]</strong>. Los aportes ya publicados pueden mantenerse sin tu nombre.
    </p>

    <h2>Cambios</h2>
    <p>Si esta política cambia, lo indicaremos en esta página con su nueva fecha.</p>
  </main>
</template>

<script setup lang="ts">
usePageSeo({
  title: "Política de privacidad",
  description: "Qué datos personales guarda Andinismo de Escritorio cuando creas una cuenta, para qué y cuáles son tus derechos.",
});
</script>

<style scoped lang="scss">
.privacy {
  width: calc(100% - 32px);
  max-width: 680px;
  margin: 60px auto;
  text-align: left;
  line-height: 1.6;
  h1 {
    font-family: var(--font-serif);
    font-size: 2.4rem;
    margin-bottom: 4px;
  }
  h2 {
    font-family: var(--font-serif);
    font-size: 1.3rem;
    margin-top: 32px;
  }
  .updated {
    color: #666;
    margin-top: 0;
  }
  a {
    color: $color-main-second;
    text-decoration: underline;
  }
}
</style>
