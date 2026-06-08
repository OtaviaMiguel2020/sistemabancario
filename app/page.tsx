import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { FieldDescription } from "@/components/ui/field";
import { GalleryVerticalEnd } from "lucide-react";


export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            
          </a>
        </div>
        <div className="flex items-center justify-center p-14">
          <div className="w-full max-w-full">
            <LoginForm />
          </div>
        </div>
        <div className="flex justify-between">
          <FieldDescription className="px-6 text-center">
            Copyright @ 2026 Hope Miguel.
          </FieldDescription>
          <FieldDescription className="px-6 text-center">
            <a href="" className="">
              Privacy Policy
            </a>
          </FieldDescription>
        </div>
      </div>
      <div className="relative hidden bg-white lg:block ">
        <AuthLayout/> 
      </div>
    </div>
  );
}
