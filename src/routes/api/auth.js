import {Router} from 'express';
import querystring from 'querystring';
import fetch from 'node-fetch';
import { challenge_from_verifier, generateVerifier, getStateValue } from '../../services/code-helper';
import {client_id, parseAccessTokenResponse, redirect_uri, urlEncodeBody} from '../../services/token_helpers';


let challengeValues = {
  state: '',
  codeChallenge: '',
  codeVerifier: ''
}

const updateChallengeValues = async () => {
  const state = await getStateValue();
  const codeVerifier = await generateVerifier();
  const codeChallenge = await challenge_from_verifier(codeVerifier);

  challengeValues = {
    state,
    codeChallenge,
    codeVerifier
  }
}

const authRouter = Router();

authRouter.get('/login', async (req, res) => {

    await updateChallengeValues();
  
    const scope = 'playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        code_challenge_method: 'S256',
        code_challenge: challengeValues.codeChallenge,
        state: challengeValues.state
      }));
  })
  .get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    if (state === null || state !== challengeValues.state) {
      res.redirect('/' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      const body = urlEncodeBody({
        client_id,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier: challengeValues.codeVerifier
      });

      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body
        });

        await parseAccessTokenResponse(response);
        res.redirect('/home');
      } catch (err) {
	console.log('error: ', err);
        res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
      }
    }
  })

export default authRouter;