<?php defined('SYSPATH') or die('No direct access allowed.');

class HTTP_Exception_408 extends HTTP_Exception {

	/**
	 * @var   integer    HTTP 408 Request Timeout
	 */
	protected $_code = 408;

}