import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    const api = req.ip
    res.send(api)
  }
}
