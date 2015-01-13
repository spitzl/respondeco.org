package org.respondeco.respondeco.web.rest;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.transaction.Transactional;

import com.codahale.metrics.annotation.Timed;
import org.respondeco.respondeco.domain.SocialMediaConnection;
import org.respondeco.respondeco.security.AuthoritiesConstants;
import org.respondeco.respondeco.service.SocialMediaService;
import org.respondeco.respondeco.service.exception.ConnectionAlreadyExistsException;
import org.respondeco.respondeco.service.exception.NoSuchSocialMediaConnectionException;
import org.respondeco.respondeco.service.exception.OperationForbiddenException;
import org.respondeco.respondeco.web.rest.dto.ErrorResponseDTO;
import org.respondeco.respondeco.web.rest.dto.SocialMediaConnectionResponseDTO;
import org.respondeco.respondeco.web.rest.dto.StringDTO;
import org.respondeco.respondeco.web.rest.dto.TwitterConnectionDTO;
import org.respondeco.respondeco.web.rest.util.ErrorHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.social.connect.Connection;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SocialMediaController
 *
 * This controller handles all requests for the connection of the account with social media platforms
 * like facebook, twitter, google+, xing.
 */
@RestController
@RequestMapping("/app")
@Transactional
public class SocialMediaController {

    private final Logger log = LoggerFactory.getLogger(SocialMediaController.class);

    private SocialMediaService socialMediaService;

    @Inject
    public SocialMediaController(SocialMediaService socialMediaService) {
        this.socialMediaService = socialMediaService;
    }

    /**
     * POST  /rest/connect/facebook
     * Post request to get the authorization URL for account connection with facebook.
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value = "/rest/connect/facebook",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> connectFacebook(){

        ResponseEntity<?> responseEntity;

        String authorizeUrl = socialMediaService.createFacebookAuthorizationURL();
        //angular needs a wrapper for strings
        StringDTO url = new StringDTO(authorizeUrl);

        responseEntity = new ResponseEntity<>(url, HttpStatus.OK);
        log.debug("Facebook AuthorizationURL: " + authorizeUrl);

        return responseEntity;
    }

    /**
     * POST /rest/connect/facebook/createconnection
     * @param code contains the authorizationcode which is needed to get the user token from facebook
     * @return responseentity with HttpStatus.CREATED if the connection was successfully created or
     *         an appropriate error if the creation of the connection was not successful
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connect/facebook/createconnection",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SocialMediaConnectionResponseDTO> createFacebookConnection(@RequestBody StringDTO code) {
        log.debug("REST request for creating a new facebook Connection with code: "+ code.getString());
        ResponseEntity<SocialMediaConnectionResponseDTO> responseEntity;

        try {
            SocialMediaConnection connection = socialMediaService.createFacebookConnection(code.getString());
            SocialMediaConnectionResponseDTO dto = SocialMediaConnectionResponseDTO.fromEntity(connection, null);

            responseEntity = new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (OperationForbiddenException e) {
            log.error("operation forbidden because no user is logged in: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return responseEntity;
    }

    /**
     * POST /rest/socialmedia/facebook/post
     * Creates a new post on facebook on behalf of the user if his account is connected to respondeco
     * @param post StringDTO containing the string of the post
     * @return responseentity containing the created post as string.
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/socialmedia/facebook/post",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity createFacebookPost(@RequestBody StringDTO post) {
        ResponseEntity<StringDTO> responseEntity;

        try{
            String createdPost = socialMediaService.createFacebookPost(post.getString());
            responseEntity = new ResponseEntity<>(new StringDTO(createdPost), HttpStatus.CREATED);
        } catch (OperationForbiddenException ex) {
            log.error("operation forbidden: " + ex);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (NoSuchSocialMediaConnectionException ex) {
            log.error("could not find SocialMediaConnection: " + ex);
            responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return responseEntity;
    }


    /**
     * POST  /rest/connect/twitter
     * Post request to get the authorization URL for account connection with twitter.
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connect/twitter",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> connectTwitter() {

        String url = socialMediaService.createTwitterAuthorizationURL();
        StringDTO urlDTO = new StringDTO(url);

        return new ResponseEntity<Object>(urlDTO, HttpStatus.OK);
    }

    /**
     * POST /rest/connect/twitter/createconnection
     * Connects a user account with twitter
     * @param twitterConnectionDTO contains the authorization token and a verifier for the token
     * @return responseentity with HttpStatus.CREATED if the connection was successfully created or
     *         an appropriate error if the creation of the connection was not successful
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connect/twitter/createconnection",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> createTwitterConnection(@RequestBody TwitterConnectionDTO twitterConnectionDTO) {
        ResponseEntity<?> responseEntity;

        String token = twitterConnectionDTO.getToken();
        String verifier = twitterConnectionDTO.getVerifier();
        try{
            SocialMediaConnection socialMediaConnection = socialMediaService.createTwitterConnection(token, verifier);
            SocialMediaConnectionResponseDTO dto = SocialMediaConnectionResponseDTO.fromEntity(socialMediaConnection, null);

            responseEntity = new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch(OperationForbiddenException e) {
            log.error("cannot create connection for user, because user is not logged in: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch(ConnectionAlreadyExistsException e) {
            log.error("connection between user and twitter already exists: " + e);
            responseEntity = ErrorHelper.buildErrorResponse("socialmedia.error.twitter.connectionexists", "connection already exists");
        }

        return responseEntity;
    }

    /**
     * POST /rest/socialmedia/twitter/post
     * Posts a tweet on twitter if the users account is connected with twitter
     * @param post StringDTO containing the post as string
     * @return responseentity containing the created tweet.
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/socialmedia/twitter/post",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity postTweet(@RequestBody StringDTO post) {
        ResponseEntity<Tweet> responseEntity;

        try{
            Tweet tweet = socialMediaService.createTwitterPost(post.getString());
            responseEntity = new ResponseEntity<Tweet>(tweet, HttpStatus.CREATED);
        } catch (OperationForbiddenException e) {
            log.error("operation forbidden: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (NoSuchSocialMediaConnectionException e) {
            log.error("could not find SocialMediaConnection: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return responseEntity;
    }








    /**
     * POST  /rest/connect/xing
     * Post request to get the authorization URL for account connection with xing.
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connect/xing",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> connectXing() {

        String url = socialMediaService.createXingAuthorizationURL();
        StringDTO urlDTO = new StringDTO(url);

        return new ResponseEntity<Object>(urlDTO, HttpStatus.OK);
    }

    /**
     * POST /rest/connect/xing/createconnection
     * Connects a user account with twitter
     * @param twitterConnectionDTO contains the authorization token and a verifier for the token
     * @return responseentity with HttpStatus.CREATED if the connection was successfully created or
     *         an appropriate error if the creation of the connection was not successful
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connect/xing/createconnection",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> createXingConnection(@RequestBody TwitterConnectionDTO twitterConnectionDTO) {
        ResponseEntity<?> responseEntity;

        String token = twitterConnectionDTO.getToken();
        String verifier = twitterConnectionDTO.getVerifier();
        try{
            SocialMediaConnection socialMediaConnection = socialMediaService.createXingConnection(token, verifier);
            SocialMediaConnectionResponseDTO dto = SocialMediaConnectionResponseDTO.fromEntity(socialMediaConnection, null);

            responseEntity = new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch(OperationForbiddenException e) {
            log.error("cannot create connection for user, because user is not logged in: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch(ConnectionAlreadyExistsException e) {
            log.error("connection between user and twitter already exists: " + e);
            responseEntity = ErrorHelper.buildErrorResponse("socialmedia.error.twitter.connectionexists", "connection already exists");
        }

        return responseEntity;
    }

    /**
     * POST /rest/socialmedia/twitter/post
     * Posts a tweet on twitter if the users account is connected with twitter
     * @param post StringDTO containing the post as string
     * @return responseentity containing the created tweet.

    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/socialmedia/twitter/post",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity postTweet(@RequestBody StringDTO post) {
        ResponseEntity<Tweet> responseEntity;

        try{
            Tweet tweet = socialMediaService.createTwitterPost(post.getString());
            responseEntity = new ResponseEntity<Tweet>(tweet, HttpStatus.CREATED);
        } catch (OperationForbiddenException e) {
            log.error("operation forbidden: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (NoSuchSocialMediaConnectionException e) {
            log.error("could not find SocialMediaConnection: " + e);
            responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return responseEntity;
    }




     */










    /**
     * Returns all Connections of the currently logged in user or
     * HttpStatus.FORBIDDEN if no user is currently logged in
     * @return response entity containing a list of SocialMediaConnectionResponse DTOs and a HttpStatus
     */
    @RolesAllowed(AuthoritiesConstants.USER)
    @RequestMapping(value="/rest/connections",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<SocialMediaConnectionResponseDTO>> getConnections() {
        ResponseEntity<List<SocialMediaConnectionResponseDTO>> responseEntity;

        try {
            List<SocialMediaConnection> connections = socialMediaService.getConnectionsForUser();
            List<SocialMediaConnectionResponseDTO> dtos = SocialMediaConnectionResponseDTO.fromEntities(connections, null);

            responseEntity = new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (OperationForbiddenException e) {
            responseEntity = new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return responseEntity;
    }



}
