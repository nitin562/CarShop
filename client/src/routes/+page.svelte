<script>
  import Button from "../Components/+button.svelte";
  import InputField from "../Components/+inputField.svelte";
  import { links } from "./endpoints";
  import {goto} from "$app/navigation"
  import { ErrorManage } from "../UtilFunc/ErrorManagement";
  let email = "";
  let password = "";
  let usertype = "client";
  let loading=false
  let error = {
    emailError: "",
    passwdError: "",
  };

  const HandleLogin = async (e) => {
    e.preventDefault();
    loading=true
    error = {
      emailError: "",
      passwdError: "",
    };
    const url = links.Login + `?email=${email}&password=${password}`;
    const options = {
      method: "GET",
      headers: {
        user_type: usertype === "client" ? "users" : "dealers",
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);
    if (result.success === 1) {
      sessionStorage.setItem("token", result.data.Token);
      sessionStorage.setItem("name", result.data.name);
      sessionStorage.setItem("type",usertype==="client"?"client":"dealer")
      loading=false
      if(usertype==="client"){
        goto("/user")
      }else{
        goto("/dealer")
      }
      return;

    } else {
      error=ErrorManage(result,["email","password"])
    }
    loading=false
  };
</script>
<svelte:head>
  <title>Login Page</title>
</svelte:head>
<div
  class="w-screen h-screen flex justify-center items-center bg-black/20 bgBack z-10"
>
  <div
    class="w-full h-full bg-black/50 backdrop-blur-lg md:w-1/2 flex flex-col gap-y-6 items-center p-2 relative"
  >
    <img
      src="./user.png"
      alt="logo"
      class="w-[35%] my-4 aspect-square"
    />
    <div class="md:w-3/4 w-full flex flex-col items-center gap-y-8">
      <InputField
        icon="fa-solid fa-user"
        type="email"
        placeholder="Enter Email"
        name="email"
        on:change={(e) => {
          email = e.detail.value;
        }}
        errors={error.email}
      />
      <InputField
        icon="fa-solid fa-lock"
        usertype="password"
        placeholder="Enter Password"
        name="password"
        
        on:change={(e) => {
          password = e.detail.value;
        }}
        errors={error.password}
      />
    </div>
    <div class="md:w-3/4 w-full mt-4 flex justify-center">
      <div class="w-[90%] flex justify-between">
        <div class="flex gap-x-4 items-center">
          <label>
            <input
              type="checkbox"
              name="userType"
              value="client"
              class="scale-150"
              checked={usertype === "client"}
              on:change={() => {
                usertype = "client";
              }}
            />
            <span
              class="text-white mx-1 group-checked:text-orange-400 font-AR_One_Sans"
              >Client</span
            >
          </label>

          <label>
            <input
              type="checkbox"
              name="userType"
              value="dealer"
              class="scale-150"
              checked={usertype === "dealer"}
              on:change={() => {
                usertype = "dealer";
              }}
            />
            <span
              class="text-white mx-1 group-checked:text-orange-400 font-AR_One_Sans"
              >Dealer</span
            >
          </label>
        </div>
        <Button title="Login" HandleClick={HandleLogin} load={loading} />
      </div>
    </div>
    <div class="md:w-3/4 w-full flex justify-center">
      <div class="w-[90%]">
        <button
          on:click={() => {
            goto("/Signup");
          }}
          class="text-white hover:text-green-500 cursor-pointer transition-all duration-300 justify-items-start bottom-0 left-3/4"
          >Register?</button
        >
      </div>
    </div>
  </div>
</div>

<style>
  .bgBack:before {
    content: "";
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background: url("/BG1.webp") no-repeat center center/cover;
    z-index: -1;
  }
</style>
