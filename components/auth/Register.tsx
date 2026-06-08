import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {Field, FieldDescription, FieldSeparator} from "@/components/ui/field"
import Link from "next/link";

export default function Register() {
  return (
    <div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-bold mb-1.5">Cria a sua conta</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Seja Bem-vindo! Por favor insira os seus dados
        </p>
        <div>
        <Button className="w-full" variant="outline" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                       Google
                    </Button>
      </div>
      </div>
      

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6 mb-8">
            <div className="space-y-4">
            <Label htmlFor="text" className="">
              Nome
            </Label>
            <Input
              id="text"
              type="text"
              placeholder="Digite o seu nome"
              required
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
            />
      </div>
      <div className="space-y-4">
            <Label htmlFor="password" className="">
              Confirmar a Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
            />
      </div>
            <div className="flex items-center">
                <div className="flex space-x-2">
                    <Checkbox />
                <Label>Eu aceito todos os termos e condiçõoes</Label>
                </div>
                
            </div>
       
    
            <div>
        <Button type="submit" className="flex w-full justify-center rounded-md
         bg-[#FF7607] px-3 py-1.5 text-sm/6 font-semibold text-white">Registar</Button>
      </div>

    
        
        </form>
<FieldDescription className="px-6 text-center">
        Já tem conta ?
        <Link href="/" className="text-[#FF7607] font-bold"> Entrar </Link>.
      </FieldDescription>
        
      </div>
    </div>
  );
}
