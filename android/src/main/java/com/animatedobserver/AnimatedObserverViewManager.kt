package com.animatedobserver

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerDelegate
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerInterface

@ReactModule(name = AnimatedObserverView.NAME)
class AnimatedObserverViewManager : SimpleViewManager<AnimatedObserverView>(),
  AnimatedObserverViewManagerInterface<AnimatedObserverView> {
  private val mDelegate: ViewManagerDelegate<AnimatedObserverView> =
    AnimatedObserverViewManagerDelegate(this)

  override fun createViewInstance(context: ThemedReactContext): AnimatedObserverView {
    val view = AnimatedObserverView(context)

    return view;
  }

  override fun onDropViewInstance(view: AnimatedObserverView) {
    view.manager.cleanup()

    super.onDropViewInstance(view)
  }

  override fun prepareToRecycleView(
    reactContext: ThemedReactContext,
    view: AnimatedObserverView
  ): AnimatedObserverView? {
    return super.prepareToRecycleView(reactContext, view)
  }

  override fun getDelegate() = mDelegate

  override fun getName() = AnimatedObserverView.NAME

  override fun getExportedCustomDirectEventTypeConstants() = mapOf(
    AnimatedObserverView.EVENT_ON_CHANGE to mapOf("registrationName" to AnimatedObserverView.EVENT_ON_CHANGE)
  )

  @ReactProp(name = "tag")
  override fun setTag(view: AnimatedObserverView, nextTag: String?) {
    view.manager.tag = nextTag
  }

  @ReactProp(name = "value")
  override fun setValue(view: AnimatedObserverView, nextValue: Double) {
    view.manager.value = nextValue
  }
}
