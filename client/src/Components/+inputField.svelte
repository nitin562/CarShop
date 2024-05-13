<script>
  import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
  export let usertype = "text";
  let value;
  export let placeholder;
  export let width=90;
  export let icon;
  export let name;
  export let errors=null;
  function handleInput(e) {
    value = e.target.value;
    dispatch('change', { value }); // Emit a custom event with the new value
  }
 
</script>

<div
  class={` border-b-2 flex flex-col relative ChangeWidth   focus-within:border-emerald-400 group transition duration-500`} style="width:{width}%"
>
  <div class="w-full h-full flex gap-x-4 items-center p-2">
    <i
      class="{icon} transition duration-500 h-fit w-fit p-2 text-xl invert group-focus-within:invert-0 bg-slate-800/20 group-focus-within:bg-emerald-400"
    />
    <input
      {name}
      type={usertype}
      on:input={handleInput}
      class=" w-[90%] text-lg md:text-2xl font-Abel caret-emerald-400 text-emerald-200 placeholder:font-thin placeholder:text-white group-focus-within:text-white outline-none border-0 indent-2 bg-transparent"
      
      {placeholder}
    />
  </div>
  <p
    class="{errors
      ? 'h-8'
      : 'h-0 overflow-hidden'} absolute -bottom-3 right-0 transition-all duration-300 text-red-400 text-sm font-bold font-Abel text-right mt-1"
  >
    {errors}
  </p>
</div>

<style>
  @media (max-width:768px){
    .ChangeWidth{
      width: 90% !important;
    }
  }
  
</style>