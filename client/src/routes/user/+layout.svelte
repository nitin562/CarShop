<script>
  import Nav from "../../Components/+Nav.svelte";

</script>

<div class="flex flex-col w-screen h-screen BgBack">
  <Nav  />

  <slot />
</div>
<style>
    .BgBack{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: url("/bg3.png") no-repeat center center/cover;
    }
</style>