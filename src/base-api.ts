import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { getClientIp } from "request-ip";
@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    const clientIp: any = getClientIp(req)
    res.send(`Your IP Address is ${clientIp}.`)
  }
}
