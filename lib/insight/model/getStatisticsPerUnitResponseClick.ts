/**
 * LINE Messaging API(Insight)
 * This document describes LINE Messaging API(Insight).
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export type GetStatisticsPerUnitResponseClick = {
  /**
   * The URL\'s serial number.
   */
  seq: number /**/;
  /**
   * URL.
   */
  url: string /**/;
  /**
   * Number of times the URL in the bubble was opened.
   */
  click?: number | null /**/;
  /**
   * Number of users that opened the URL in the bubble.
   */
  uniqueClick?: number | null /**/;
  /**
   * Number of users who opened this url through any link in the message. If another message bubble contains the same URL and a user opens both links, it\'s counted only once.
   */
  uniqueClickOfRequest?: number | null /**/;
};