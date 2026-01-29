import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth } from 'googleapis';
import { shell } from 'electron';
import http from 'http';
import url from 'url';
import { googleAuthHtmlResponse } from "./google-auth-html-response";

@Injectable()
export class StartGoogleAuthUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client
  ){}

  async execute(): Promise<void> {
    return await tryCatch(async () => {
      let server: http.Server | null = null;

      try {
        server = http.createServer(async (request, response) => {
          if (request.url?.startsWith('/?code')) {
            const querySearch = new url.URL(request.url, 'http://localhost:3000').searchParams;
            const code = querySearch.get('code');
  
            response.end(googleAuthHtmlResponse);
            server?.close();
  
            if (code) {
              const tokens = await this.oAuth2Client.getToken(code).then(res => res.tokens);
              console.log('Tokens:', tokens)
            }
          }
        }).listen(3000);
  
        const authUrl = this.oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/drive.file']
        });
  
        shell.openExternal(authUrl);
      } catch (error) {
        if (server && server.listening) server.close();
        throw error;
      }
    }, `Erro ao iniciar autenticação no Google` );
  }
}