<?php defined('SYSPATH') or die('No direct access allowed.');class Controller_Plugins extends Controller_System_Backend{		public function action_index()	{		$this->template->content = View::factory('setting/plugins', array(			'plugins' => Plugins::findAll(),			'loaded_plugins' => Plugins::$plugins		));	}        public function action_activate($plugin_id)    {		$this->auto_render = FALSE;		Plugins::activate($plugin_id);		Observer::notify('plugin_after_enable', array($plugin_id));				Messages::success(__('Plugin <b>:plugin_id</b> successfully activated!', array(':plugin_id' => Inflector::humanize($plugin_id))));				$this->go_back();    }        public function action_deactivate($plugin_id)    {		$this->auto_render = FALSE;        Plugins::deactivate($plugin_id);        Observer::notify('plugin_after_disable', array($plugin_id));				Messages::success(__('Plugin <b>:plugin_id</b> successfully deactivated!', array(':plugin_id' => Inflector::humanize($plugin_id))));				$this->go_back();    }	} // end class PluginsController