"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const {data:session} = useSession(); 
  const [providers, setProviders] = useState(null);
  const [toogleDropdown, setToogleDropdown] = useState(false);


  useEffect(()=>{
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
      
    }

    setUpProviders();
  }, [])

  return (
    <nav className="w-full flex-between mb-16 pt-3">
      <Link href='/' className="gap-2 flex-center">
        <Image 
          src={'/assets/images/logo.svg'}
          width={30}
          height={30}
          alt="Promptopia Logo"
          className="object-contain"
        />
        <p className="logo_text ">
          Promptopia
        </p>
      </Link>

      {/* Desktop Naviguation */}
      <div className="sm:flex hidden">
          {session?.user?(
            <div className="flex gap-3 md:gap-5">
              <Link href="/create-prompt" 
                className="black_btn">
                  Create Post
              </Link>

              <button type="button" onClick={signOut} className="outline_btn">
                  Sign Out
              </button>

              <Link href="/profile">
                  <Image 
                    src={session?.user.image}
                    alt="profile"
                    width={37}
                    height={37}
                    className="rounded-full"
                  /> 
              </Link>
            </div>
            ):(<>
            {
              (
                providers && 
                Object.values(providers).map((provider)=>
                  <button
                    type="button"
                    onClick={()=>signIn(provider.id)}
                    className="black_btn"
                    key={provider.name+'-'+Math.random()}
                  >
                    Sign In
                  </button>
                )
              )
            }
            </>)
          }
        </div>

        {/* Mobile application */}
        <div className="sm:hidden flex relative ">
          {
            (session?.user?(
              <div className="flex">
                <Image 
                    src={session?.user.image}
                    alt="profile"
                    width={37}
                    height={37}
                    className="rounded-full"
                    onClick={()=>setToogleDropdown((prev)=>!prev)}
                  /> 

                  {(toogleDropdown && (<div className="dropdown">
                    <Link 
                      href="/profile"
                      className="dropdown_link"
                      onClick={()=>setToogleDropdown(false)}
                    >
                      My Profile
                    </Link>

                    <Link 
                      href="/create-prompt"
                      className="dropdown_link"
                      onClick={()=>setToogleDropdown(false)}
                    >
                      Create Prompt
                    </Link>

                    <button
                      type="button"
                      className="mt-5 w-full black_btn"
                      onClick={()=> {
                        setToogleDropdown(false);
                        signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>))}
              </div>
            ):(<>
              {
                (
                  providers && 
                  Object.values(providers).map((provider)=>
                    <button
                      type="button"
                      onClick={()=>signIn(provider.id)}
                      className="black_btn"
                      key={provider.name+'-'+Math.random()}
                    >
                      Sign In
                    </button>
                  )
                )
              }
              </>))
          }
        </div>
    </nav>
  )
}

export default Nav