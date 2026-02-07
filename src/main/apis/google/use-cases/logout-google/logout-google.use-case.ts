import { Inject, Injectable } from "@nestjs/common";
import { Auth } from 'googleapis';
import { tryCatch } from "@main/common/utils/try-catch";
import { DeleteGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/delete-google-token/delete-google-token.use-case";

@Injectable()
export class LogoutGoogleUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(DeleteGoogleTokenUseCase)
    private readonly deleteGoogleTokenUseCase: DeleteGoogleTokenUseCase
  ) { }

  async execute(): Promise<void> {
    return await tryCatch(async () => {
      // 1. Revogar o token no Google (Opcional, mas recomendado por segurança)
      const currentToken = this.oAuth2Client.credentials.access_token;
      if (currentToken) {
        await this.oAuth2Client.revokeToken(currentToken).catch(() => {
          console.warn('Não foi possível revogar o token remotamente, procedendo com logout local.');
        });
      }

      // 2. Limpar as credenciais na instância local do OAuth2Client
      this.oAuth2Client.setCredentials({});

      // 3. Remover os tokens do armazenamento seguro
      await this.deleteGoogleTokenUseCase.execute();
    }, 'Erro ao realizar logout do Google');
  }
}