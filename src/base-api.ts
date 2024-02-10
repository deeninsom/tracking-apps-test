import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    // Mengambil alamat IP dari header x-forwarded-for
    const forwardedFor: any = req.headers['x-forwarded-for'];
    let userIp = '';
    if (forwardedFor) {
      // Header x-forwarded-for bisa berisi beberapa alamat IP yang dipisahkan oleh koma
      // Alamat IP pertama dalam daftar adalah alamat IP asli pengguna
      userIp = forwardedFor.split(',')[0];
    } else {
      // Jika header x-forwarded-for tidak ada, gunakan alamat IP langsung dari request
      userIp = req.ip;
    }
    
    // Mengirimkan alamat IP pengguna sebagai respons
    res.send(userIp);
  }
}
