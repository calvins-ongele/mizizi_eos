import { fail , ok } from "@/engine/core/http/responses";
import { platform } from "node:os";
import { exec } from 'child_process'; 

export async function POST(req: Request) {
  try { 

    const { url } = await req.json();
   
    await openBrowser(url);
    return ok("success");
    
  } catch (e) {
    return fail(e);
  }
}


  async function openBrowser(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let command: string;

        switch (platform()) {
            case "win32":
                command = `start "" "${url}"`;
                break; 
            case "darwin":
                command = `open "${url}"`;
                break;

            default:
                command = `xdg-open "${url}"`;
        }

        exec(command, error => {
            if (error) reject(error);
            else resolve();
        });
    });
}
