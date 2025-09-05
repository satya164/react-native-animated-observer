package com.animatedobserver

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerInterface
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerDelegate

@ReactModule(name = AnimatedObserverViewManager.NAME)
class AnimatedObserverViewManager : SimpleViewManager<AnimatedObserverView>(),
  AnimatedObserverViewManagerInterface<AnimatedObserverView> {
  private val mDelegate: ViewManagerDelegate<AnimatedObserverView>

  init {
    mDelegate = AnimatedObserverViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<AnimatedObserverView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): AnimatedObserverView {
    return AnimatedObserverView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: AnimatedObserverView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "AnimatedObserverView"
  }
}
