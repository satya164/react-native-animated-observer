package com.animatedobserver

import android.util.Log
import java.util.concurrent.ConcurrentHashMap

class AnimatedObserverEventManager(private val emitter: (value: Double) -> Unit) {
  private val TAG = "AnimatedObserverEvent"

  var tag: String? = null
    set(value) {
      if (field != value) {
        Log.d(TAG, "Tag changed: $value from: $tag")

        cleanup()

        field = value

        value?.let {
          register(value)
          emit()
        }
      }
    }

  var value: Double? = null
    set(value) {
      if (field != value) {
        Log.d(TAG, "Value changed: $value for tag: $tag")

        field = value

        emit()
      }
    }

  fun cleanup() {
    unregister?.invoke()
    unregister = null
  }

  private var unregister: (() -> Unit)? = null

  private fun register(tag: String): () -> Unit {
    synchronized(observers) {
      val callbackList = observers.getOrPut(tag) { mutableListOf() }
      callbackList.add(emitter)
    }

    return {
      synchronized(observers) {
        observers[tag]?.let { callbacks ->
          callbacks.remove(emitter)

          if (callbacks.isEmpty()) {
            observers.remove(tag)
          }
        }
      }
    }
  }

  private fun emit() {
    Log.d(TAG, "Notifying observers for tag: $tag with value: $value")

    tag?.let { currentTag ->
      value?.let { currentValue ->
        val observersList = synchronized(observers) {
          observers[currentTag]?.toList()
        }

        observersList?.forEach { callback ->
          try {
            callback(currentValue)
          } catch (e: Exception) {
            Log.e(TAG, "Error notifying observer for tag '$currentTag' with value $currentValue: ${e.message}", e)
          }
        }
      }
    }
  }

  private companion object {
    private val observers = ConcurrentHashMap<String, MutableList<(Double) -> Unit>>()
  }
}
