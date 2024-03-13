<script lang="ts" setup>


const classes = {
   container: 'rounded-16px flex-grow ml-0 mr-0 sm:my-auto sm:ml-[200px] mr-[200px] bg-white'
}
</script>

<template>
<div :class="classes.container">
         <form className="form space-y-[20px]">
            {errMsg && <h2 className="error-msg">{errMsg}</h2>}
            <h1>Đăng nhập</h1>
            <div className="form-group">
               <label htmlFor="name">Tài khoản</label>
               <input
                  ref={userInputRef}
                  autoComplete="off"
                  type="text"
                  required
                  value={user}
               />
            </div>
            <div className="form-group">
               <label htmlFor="image">Mật khẩu</label>
               <input
                  type="text"
                  autoComplete="off"
                  required
                  value={password}
               />
            </div>
            <div className="persist-check">
               <input type="checkbox" id="persist"/>
               <label className="ml-[8px]" htmlFor="persist">
                  Trust this device :v ?
               </label>
            </div>

            <Button isLoading={apiLoading} primary className="leading-[30px]" type="submit">
               Đăng nhập
            </Button>
            <span className="register-text">
               Chưa có tài khoản?
               <Link to="/register"> Đăng ký ngay</Link>
            </span>
         </form>
      </div>
</template>