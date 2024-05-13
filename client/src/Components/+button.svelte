<script>
    export let title;
    export let HandleClick;
    export let load=false
    import {Spinner} from "flowbite-svelte"
</script>
<button on:click={HandleClick} class="hover:bg-blue-500 flex gap-x-2 items-center hover:text-white font-Arsenal text-lg p-2 rounded-lg border-none outline-none px-4 bg-white text-blue-500 font-bold transition-all duration-300 md:text-xl ">
    {#if load===true}
        <Spinner size={6}/>
    {/if}
    {title}
</button>