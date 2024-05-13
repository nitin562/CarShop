<script>
    import DealerNav from "../../Components/+DealerNav.svelte";
  
  </script>
  
  <div class="flex flex-col w-screen h-screen BgBack z-10">
    <DealerNav/>
  
    <slot />
  </div>
  <style>
      .BgBack:before{
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: url("./bg3.png") no-repeat center center/cover;
          z-index: -1;
      }
  </style>