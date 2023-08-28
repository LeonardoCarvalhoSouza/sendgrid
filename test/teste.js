const request = require('supertest');
const chaiHttp = require('chai-http');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;


chai.use(chaiHttp);

describe('Testes da API', () => {
  describe('Envio de Email', () => {
    it('Deve enviar um email com sucesso', async () => {
      const response = await request(app)
        .post('/sendEmail')
        .send({
          destinatario: 'leonard.patrick@hotmail.com',
          assunto: 'Assunto do Email',
          texto: 'Texto do Email',
        });

      expect(response.status).to.equal(200); // Corrigido aqui
      expect(response.body.message).to.equal('Email enviado com sucesso!'); // Corrigido aqui
    });

    it('Deve retornar erro 400 se campos obrigatórios estiverem ausentes', async () => {
      const response = await request(app)
        .post('/sendEmail')
        .send({
          destinatario: '',
          assunto: 'Assunto do Email',
          texto: 'Texto do Email',
        });
  
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('Campos destinatario, assunto e texto são obrigatórios.');
    });

    it('Deve retornar um erro 500 quando ocorrer um erro no envio de email', async () => {
      const response = await request(app)
        .post('/sendEmail')
        .send({
          destinatario: 'destinatario_invalido',
          assunto: 'Assunto do Email',
          texto: 'Corpo do Email',
        });
  
      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Erro ao enviar o email.');
    });

    it('Deve enviar um email com anexo em base64', async () => {
      // Substitua 'anexoBase64' e 'formato' pelos valores apropriados
      const response = await request(app)
        .post('/sendEmail')
        .send({
          destinatario: 'leonard.patrick@hotmail.com',
          assunto: 'Assunto do Email',
          texto: 'Texto do Email',
          anexoBase64: 'iVBORw0KGgoAAAANSUhEUgAAAc8AAACLCAYAAAAHxhLlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAABdMSURBVHhe7Z29zuTGlYZ1O4LlH8mSHSzgxWYDGxvuKnaiYAwnugCvQjkY6A4MR8ZgMmMFbDADKDDgVNAAVqaFF9AFGL6BXtYfeerUKVZVs5vN7u8JHrg/slh16vy9ZI/cfOfdd989weV59uyZeRwAAO4fxPNKIJ4AAI8L4nklEE8AgMcF8bwSiCcAwONiiufpP98HAAB4sljaKKmK53vvvQcAAPDkQDwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAGQTwBAAAG2Uk8n59eff3d6bvvJG9Pr35rjYX758XptYj125fPjTGOmBdfvzo9N89flxdvFhvbtgIALOwqnrIxPX/5dmpWCOhjU8bdOn9L8UQsAeAcbiae7cYK98+xY4x4AsC53FA8w1d72bEvXudfo715oca7J9X4tOLH6CdXeS7w+gt5Xn9V9/r0Qpzr4revTm/F/Lr5poYcnqzLMf6425fca7bP9FReW6PHDy20n/Lrk42ZHcrGPqy4B7I4FE+e4brXX+R26ljqfCnON+gTz2TDGbkCAA/LzcQzNGbZkCZRkA06itTSEJd/R0vz+DlE4/UNeaXJ+/NifGlDg4pNcl+zKKR1/DWLOC2ClNYNc6Q5Tb9ka7T9sE4UA+knL0KGjWlMse9eyrhrbNsX0az6Rdl8jo2ZgDtMHyKeAFCyq3i2G5VEN95SqEIDXZpaaIa1Jueu109ouXC18A1cibNu/lqg9RqFCGT71HsW18xztv2wihLzQL6u3lPNrjbt68q1HMZ1ym7nZz2v9/3KzdM6Yc3SFgCAkps9eVoUTwKZSPQJXTaHbITxyUTOnegVT8s+j1in1cBtsUhU9piJ45jgF1SEVtp9fPGMQidjkDhbPCdGbkIA4ElzGPH0TbT6ROb+HhWN2GDnZuqu109cY3gbG815m3jafsqv2SieD/zkuRVvC+IJAB0cRjy96IgmGhqZvGZcNLSQ6TWGiU+vazZsE0+jgRdrbhTPGAtpo16ztPF44hmeErfdDGVEP5e2Rn8hqgAgOIx4JlGQX7/lTxct0UhNTmCIlBc3OWa0KcYmK+eQ+9oqng5tY77nreLpUL5WPtgsnl7Y5PyR2S96/USyo0M8HcY6/X7R+VIT4jQO8QSAhZ3EEwAA4HFAPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPAEAAAZBPK9CfBOH8faU8Pqv9CaP897UEd66Eq6Vn62xh0W+Aqz6OrCjI+Ncj/kmuvyk3xAzkg/h2qrvrbfZtK65Bc0XmR/Q5ktwlRe463x6QL9dAMTzKsTkW2ukG5LeC2acW362xh6WKAT+FWLyszX2sMQ4+1etyc/W2DNp+snKtRen1yN2uFys5dC9iGe0qZ5DR7T5AlxcPOPrAi+dxw8I4nkrNiS9fN9mz/tBj4l8L6n8fF/4m5fYaOTny7Hup/BNxtbmueL/uxHPVi0gnl2Y8QaLJyee4WvOhEw610CmpHnpknE6NxXhi/QVq2yI8e5/nkMVazb/mqhd/I7x8chjZYjGFJcgHnGMFi4Vq6xxev/bx5Z1QsNN19dfmN3AWusiDAhCw4bkz+Jcr3jG+Wd07q/FYsLF2h2T8bTGpHPW+bmGzRj1+ErFu6jf9Xw4Jyet/jHqB91HsvUn1vesSPZZuQAZT0o8fdKJZA1JlhIv3H378zKBfFNIY6bieSOTPVxjJaefuyg+QTYvFEz+WXvCmhtEKvIYs/ka/bcVKx+D2ACL8bFRyiYix6djPfjrBptYF/X8K2jaUBEe7xd9XAmROUbQEYtZEFLNqDmb9RTx48zGr2yunJfX5v2inQ/NnHRzNPpHyw+6hwUbdF3IvjKQI4mYK9leoOAJiafVHEJiheQWn2XC+s91kfPJbCRYs9hV0kODZjPNm6PVRK2YhGOTUOvGqtYLtBrw3pzRGFdwuVzM1eMHP6ZuR08sClHIajOOL+wwqNZrI3bWdXLvHX4o86udL7p/rPvBfVY2ZH3EXq+0qxMhossNACSejnjGAp/vqAQj4hmKWM2BeF6BEI/c10vjaDUq34SK6yeKmITriuOV+Ohmd1vazXkIlevLsXXRWMYtfpbNticWPX7Na69eO26u0icNXwmhyIl778iHVk7OY/QaWjxrfrBikdmV33DYYwwbiprICePr/n6qOA189uzZKg/85CnpEE+fhPkctWQvC0lRKUZwREGTflWNo9Wo/PlaExKk+BVxtBpVqwHfAG93o/n1E/aXNd8VPxRNOqHqpCcWq6JhsLpvt35xrhE7WecWHfnQysme/rHqB8uGrI/Ye2z2ohbm3mHnJ8/0NFEPhE+eaUwtyX0iuDkGCi2xWnAd4hnWFgXmE9e2pZmwWdKXtPzQxNu9tt8jE2Kx7D00haIhrzWquP9qg5/I41lZU8S2iH8vMU/OjuUaKc5ZDk570TnZa4MbZ/h1yA+yfua/12OxKhoG6/UVbM7XU/lRUO6zdV77obQpX7Pwm9E/1v2g9pCu1zbINTp832K9bz5dnpR4OtL8CynR2uI5F1C6dkoo/1/kzrak/Wkq18+U/mj5oc2y1pbCuRlzY0h7cL4dEE9HbBxynryRKd8UAqPjKZrSCMW8l6bDzm4bcj8vx1bmV7FyFDm3EgvHumis1a2Nj282X6X2WmOyHFv3Qzsn1fxF/2j7IffjtH7WnwLaV0P1b8Qy3xMkdhZP2JMgEPUbFQCLUnjuEesmAOByIJ4PS7xL5q4RRvFPM/cvPM2nOIANIJ4PSPpKksYBAHAdEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE8AAIBBEE+Arfgf0+Z3VAGeEognwCbiD5C/nASU3xEGeDIgngAbWN5AEl43dZevfwOAYRBPgLNRr71yX9/y9AnwJEA8Ac6kfOWVfvkxADwqiCcAAMAgO4pnfDmzQP/7kL+Tl2PU+yjn91Qm9Fdk/iW+4nzxX0BiQ+D6NjwVPwHA04QnTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEEQTwAAgEF2E8/ixcSe16cXxtjDE1+i/Pblc/v8Hqza8Pz06uvc1/O4L15nxzPiy6StWGUvgS5eIh1Ia6SXVGfXuHX1y6iVLdZewlzXzJPoq9qLsrPjYWzYV/isbfa+i9eUtqe4pGPly7b1Xlt104xVYo+cjfHU6zfzwV+nYxx8M19jjpGo8TVu5oeyJhfSS9iNfJD5523XL2xXeVipzcIve/jhwdlXPHWDOiJmgioOkXih0EobYgFGIVyjFpPiuG8Glk/shuWb5ddvT2+lDbJZToSmn8/5/OXrYo0wbq1pbifYq/wQ8+DttI/FpnPEU/onNce0n9J/2pZajBKjsbpqzsa6GM4Hb/NO4nlDPyzUbNXHo+Amv5m9yRJPK/6aHfzw4CCemu7kuzWVAhywvxaT8nhvsQd8s3zzaipqYYdsls3msrBH3gR71c1G8uMk6Mu5EfGMY9+I6ycfvH35avJZ8ovhP+mnbD4xRrA1VhelknvNfDCFUdlrjpH07u92fljoj1EWX3PebeJ5VT88OAcRz5AAeXHEY7LA3GdfRG6sHi+uSeet9XxyiTFpjuL4wtIgQ8KVxxPuvEtcOc5O9jTHjG7e55L20TFfLSb6uP/bbFx2ASYxctfNPhLNcj0XDsLchNwe095D7MJ+w+d18YzXx72+eJPmSzmh/VfO2fKVPu//NmN1O1r5sK94HoGarfp4+Hv2mSmMKmfMMXAN9hXPKREysqYQkiA1fV9w8nwSzflYPr7825gjCstqgXUlX9nkAiHZpWBqG8y/hc0XIfnKsTJ3rTGXsao1LbsJLHuazqf5RbMs4nJERB44f4Q9hrjLzzoHFp+68+H6WTT9ceezlB8pXwTKL6266Y/V7Wjlgy2MwTdzbpljJGr8oanZWuZDll/d4pnPYX+ND1s5yJNnIiaV+6pLF4pVPLIAfdKo8yrZuoTKTFDNunhmRZHZLZuvON/0y5n4tUMBWU2lFpPsuOX3GbsJSD+7z/682GcunrJhHKjIZR64z95eGT87BxbfuX3F66e9u387DWPFccN/uW/addMfq9vRygfbbuWb5t5KXx6Xmq3yuJFfZm9S47r6F1yCg4nnhC8SI7Gs4pHH4nUlKZHsZldwVfHUzTHM0xT0jXjfG42nFpP8eLDRbkp2E5DN0u/ffXb/G+e013VzHajoszxwPnCfpS/sHFj2JvejP6c5LP/lfqjFKNEfq9vRygddIwHlG3OMxPLlUanZauxZxh7xPBTHEs8U+C+MBDCKJ5vTX7tWXKqIa3Qln904zaJQdnsbpjEzLZ9cgsqeajEpjusinrGbQO5n56tp/3IO7xNtj5ur5fcd0T6bbH778oUQpxXx9Huv7UcKnOE/tW6rbvpjdTv68kHXrvKfOUZi5+Ixqdmqj8tcmTDruGcMXIMDiWdInNSM/HhZLEXx5ONTEq2Ko5+jVWB6Xouw1rh4uvP7J7ZvXobvazEpjxv7Wjmub1LcfP6reDFnuInQ8Rz3TZinFdMzKJrQZN/U9F+LRlXkqL8mna/tRza70n86VrUYJfpj1SDavrbWubTzIdgs60n7YTfxvKIfFmq2lsfz+JY9zs7BC/SYXfxw3+wrni4YGVJUdKBioqQxUfgkZfKlawQ6+MU8RkGqMXNRGzZ45mQ2ikIV/bofLoBlY6UA8sJcP54VaSosRfKTbpZ2fBfhWzij6NN+K3s8G6MJpdjJ+Oo9zOeqTawUT3l97rd2vjRj1c1SO2VdbaMrH3RO6XiatSf9a/hyYv0m2OJ6flgw+kT1eDi27EPvU8W5Upvje9nDD/fNbuK5GSVCd4nZUGOSqqYJvcRmgv82E0T3jBuYBwM/BPDDOojnnvg96GTUd5YwQihw7o63E29CLv0Ef3fghwB+aIF47kxq9hKE8xxicXNnvJk5J5/40zt+COCHPu5HPAEAAA4C4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4nnPzL/3ecQfj0g/YhDh/3ANAA/E7uIZfkjbaPbmDxobvx6TBMNoxv6XMRo/J1X8GLmcp/dHleO4q/4yUNxn/WfngjjVz8ffzL3mz2ut+qFln2MHG4/AHvky0+P3Cir/tb3V2r0CtVre0waANXYXz/DTTzXxbP/Umiue1y/d2HKOdfHsaNSdNqQGddVmGBtZtQn68+tNxDeaqwrTmh/6mvj1bdxGzw1Zmx3yZeZc8WzbeATxrPYPgJ25jXhazahLuFyBu8IJQqgbxHqj62gqg+I53qAGaNnS8Vu/vtld9evSNT/0+ej6Nm7jkuJ51XyZOXOt7tzfh1Xx3BwPgO3sLp5VeorXCUYsHKvp9ojnauEdrIGs0iGet2VPwaiQvuLPkPGNOTGz+NPnUnYuccn8MHyUxTXdJMZvTaINhU+NfWZjfF4v58yny5Xcz31R5pw/P9ViNk7fEDVtyPfoQSThwNyVeDrBnIvOEI918ZyQBWyNUwUeOKaYpoZlnTsGNxbPGMt5/SK/gn2yiYfmP5hTm+gTT5eHaUxhox9f7ivft1wj33eYT+e8oxRJq+Yc8xwpH03f122Y9yny+bp+B9jOwcRTFq9DFqoruJUmMdFdcGKt7A7YHz+mWM7Ep4zM7kNSxmdXnJ+yXEhPceJ8IQQbcuosDB9ldgWb13I0u6H05HN6+9VNlrmnntxfE0/D18mupg1+7Xxe00aAA3E/T55F4ZaNZbjg/JxizXsQz4jVkI7FjcXTx1KL5RJbO1cukFNDbBVP47ya0//zxvR3gd5TT+6fKZ5NG4x5r+t3gO3cjXj2NIHxglPN647Es9bIjsMxxFPmSl2kEqXN9y6e3v6em6wrimfTBsQT7pA7Ec9KI1bXjBacHy+LtqeB9ODnyYX94mwWz+DTbXOsUYnZEOfb2GzYcW4pPP4GTcfM+/kCOWGixC/lzbzflnjqnE/+En6Pczbj0JP7Z4pn24Y8V0JdGrEAOBD3IZ7+nNVAjTtcV3QZ8bpYwOa5hDnmHAEIdp13bSebxXN5ms+a88W4hHhusXEREkkpROJ8pVnn33pcWEh9HNPcUzyzXG+Lp8w1R/ovczO/G3ld+LOYN5HPv7CMbYqno2WD9IOby/2NeMKBOY54PhhByC/caCVZkz2T2LCuI/CXEc9zbfSCp588/VxXjAkAPBkQz6sQn3queue8VZzSE8VGAa5yCfE818Z4nRLPcENzrf0CwFMC8bww81fHPf+Rxlbmr7oGBSFdt4O4B/vO8MdmG9X6HoQTAC4D4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADAI4gkAADBIl3h+8MEHJw3iCQAATxWngZY2SqriCQAA8FSxtFFiiicAAADUQTwBAAAGQTwH+MUff3j63dc/Ov1y+vzLP//g9Lu//Pj0CzXmcPz+R5PNPzx9/JvcfnPsIJ9/+bPTP/7vo9Ofps9/+uvPT//49sPT52rMWfzho8vNtSNfffvz0zd/sM89Ck9hj2dz0LwNdTrVp+OvPzXHXIqR/Lj3XDqGeP7rx6fnn356+lTy61/ZY28I4pnTFs+fnr5JRTvx/Zfy3Dpfffuz01efGedcg4prrh67Bc6OanNyvqjs6Y64ZMPzOSPy49qNfQ9qeZsJWGRv4fA2HEg81+vlurjcG+lHFu/8u3Fwd5x4Pv/4PoQoCqYXoj//xB53JH7z49OnSTCF/ebYUcSddlGYn314+n5qEDJBP//yo27xqBb6kcVzVSART4mP7x1+u9CilrfFfn3O7iug1Zq6IGP5cbuauIh4/vPfPjjdXEDvRTwbhCe76YnUE572wrmfnD5xAuaFLJ5XIpZfK54O/ZPjD06f/D6Nff/08V/y6/Nr5dg+Pvvyb6e///1vp//+L/v8OfinilahGgK7UCmsHvGMjSmh53cFPp8vBN/N49aO51WD9w0onZvQjaLeoFqNQqw5oW1eWzc87cjrLf/Y16YmIufP95TbZV2/nOtvhC4GteblbbH8Lo5pf3iE36sxts5n/lL7VWt+/+WH8fx0TfJrNr8d55491XxZa/SzUDk7JhukT6zx/rzhC3mdI4+/Pq/3tp4fXXMbNiXOidOaP7Q9M9KGlXpxpDi9c/qP90//82F+cnceQTwnYfzkj8t/3uwFbRY4J55SFMPfs8h5gVwEM782iWM4r8/pa8PfUrjbXF48Q2LrpCtYFc9K0/CJbYlDOmY3r4RPfFEoWROP9iwNQu1jFtf4t0V1zLpdmR16Xb1n//cyV2gw+d/ZXEVjWOaaG3Yc45uLaET5XOHvZJceGxpTwz+R1MSK+Dq8D3NfZXao834PWoRqMY5/Z81SsDY22BzW9cfdmka8rbzVvvKIWKz50n827HU2+Fj4ecSedL5EzHn0WP+38P20v2/EXrSdlr8uUy+5761z1Zh2+MOKUWC9XuT+33H/f5b//Zd04Y0o/s3z16dfWePuCfl1qRfLXNDcv5l+GsXWfc6fFmvjJ4HOjoen0DRPPrb9/1O6Hqr5n4tVWEYh5MfC2tXCsK5NzcCvl9udFZlx3sIuTLd2Lggzbl7VWGWj043CIdfIGtZErdkGcjvcPFlTlz6Xvoksa9kx1rasEv3pG51ap/T7EjfdwMv4r8Q4G6uwzom1dUz8PpVt+pp0rLDZMY9r+NLZFddd/CLiKPfnyWOcsPLCrbGWWwVyb8W6Kv5+bDsfzPU2xKnHH6t7zJDXyjh9cPp/AhYZQpz9GYkAAAAASUVORK5CYII=',
          formato: 'png',
        });

      expect(response.status).to.equal(200); // Corrigido aqui
      expect(response.body.message).to.equal('Email enviado com sucesso!'); // Corrigido aqui
    });
  });
});
